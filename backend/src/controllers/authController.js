const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { signToken } = require('../utils/jwt');
const {
  ROLES,
  resolveRoleForEmail,
  publicUser,
} = require('../constants/roles');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = resolveRoleForEmail(normalizedEmail, ROLES.USER);

    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role,
      },
    });

    const token = signToken({ userId: user.id });

    return res.status(201).json({
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const expectedRole = resolveRoleForEmail(user.email, user.role);
    if (user.role !== expectedRole) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: expectedRole },
      });
    }

    const token = signToken({ userId: user.id });

    return res.status(200).json({
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

const me = async (req, res) => {
  try {
    return res.status(200).json(publicUser(req.user));
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

module.exports = { register, login, me };
