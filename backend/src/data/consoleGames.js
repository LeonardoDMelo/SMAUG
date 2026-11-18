const coverArt = (seed) =>
  `https://placehold.co/200x280/0f172a/f59e0b.png?text=${encodeURIComponent(seed)}`;

const catalog = [
  {
    id: 'local-zelda-nes',
    name: 'The Legend of Zelda',
    releaseDate: '1986-02-21',
    developer: 'Nintendo R&D4',
    genres: ['Action', 'Adventure'],
    consoleName: 'NES / Famicom',
    coverUrl: coverArt('Zelda NES'),
    synopsis:
      'O primeiro Zelda no NES: exploração não linear, segredos e a Triforce, nascido no Famicom Disk System.',
  },
  {
    id: 'local-zelda-alttp',
    name: 'The Legend of Zelda: A Link to the Past',
    releaseDate: '1991-11-21',
    developer: 'Nintendo EAD',
    genres: ['Action', 'Adventure'],
    consoleName: 'Super Nintendo / Super Famicom',
    coverUrl: coverArt('Zelda ALTTP'),
    synopsis:
      'Link atravessa o mundo da Luz e o das Trevas para resgatar as donzelas e derrotar Ganon no Super Nintendo.',
  },
  {
    id: 'local-zelda-oot',
    name: 'The Legend of Zelda: Ocarina of Time',
    releaseDate: '1998-11-21',
    developer: 'Nintendo EAD',
    genres: ['Action', 'Adventure'],
    consoleName: 'Nintendo 64',
    coverUrl: coverArt('Zelda OoT'),
    synopsis:
      'Link viaja no tempo com a Ocarina do Tempo para impedir Ganondorf e salvar Hyrule neste marco do Nintendo 64.',
  },
  {
    id: 'local-zelda-mm',
    name: 'The Legend of Zelda: Majora\'s Mask',
    releaseDate: '2000-04-27',
    developer: 'Nintendo EAD',
    genres: ['Action', 'Adventure'],
    consoleName: 'Nintendo 64',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/57/The_Legend_of_Zelda_Majora%27s_Mask_box_art.jpg',
    synopsis:
      'Link enfrenta um ciclo de três dias para impedir que a lua colida com Termina neste spin-off sombrio da série Zelda.',
  },
  {
    id: 'local-zelda-ww',
    name: 'The Legend of Zelda: The Wind Waker',
    releaseDate: '2002-12-13',
    developer: 'Nintendo EAD',
    genres: ['Action', 'Adventure'],
    consoleName: 'GameCube',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/7/79/The_Legend_of_Zelda_The_Wind_Waker.jpg',
    synopsis:
      'Link navega o Grande Mar em cel-shading neste clássico do GameCube que reimaginou a fórmula Zelda.',
  },
  {
    id: 'local-zelda-tp',
    name: 'The Legend of Zelda: Twilight Princess',
    releaseDate: '2006-11-19',
    developer: 'Nintendo EAD',
    genres: ['Action', 'Adventure'],
    consoleName: 'Wii',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/7/79/Zelda_Twilight_Princess_Game_Cover.jpg',
    synopsis:
      'Link assume forma de lobo e atravessa o Crepúsculo para restaurar a luz de Hyrule no GameCube e no Wii.',
  },
  {
    id: 'local-zelda-botw',
    name: 'The Legend of Zelda: Breath of the Wild',
    releaseDate: '2017-03-03',
    developer: 'Nintendo EPD',
    genres: ['Action', 'Adventure', 'Open World'],
    consoleName: 'Nintendo Switch',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg',
    synopsis:
      'Link explora um Hyrule aberto e não linear após despertar de um sono de 100 anos para enfrentar Calamity Ganon.',
  },
  {
    id: 'local-zelda-totk',
    name: 'The Legend of Zelda: Tears of the Kingdom',
    releaseDate: '2023-05-12',
    developer: 'Nintendo EPD',
    genres: ['Action', 'Adventure', 'Open World'],
    consoleName: 'Nintendo Switch',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fb/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg',
    synopsis:
      'Sequência de Breath of the Wild em que Link combina objetos e explora ilhas no céu para salvar o reino.',
  },
  {
    id: 'local-mario-bros',
    name: 'Super Mario Bros.',
    releaseDate: '1985-09-13',
    developer: 'Nintendo R&D4',
    genres: ['Platformer'],
    consoleName: 'NES / Famicom',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/03/Super_Mario_Bros._box.png',
    synopsis:
      'Mario atravessa o Reino dos Cogumelos para salvar a Princesa Peach neste platformer que salvou a indústria.',
  },
  {
    id: 'local-mario-world',
    name: 'Super Mario World',
    releaseDate: '1990-11-21',
    developer: 'Nintendo EAD',
    genres: ['Platformer'],
    consoleName: 'Super Nintendo / Super Famicom',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/32/Super_Mario_World_Coverart.png',
    synopsis:
      'Mario e Yoshi atravessam Dinosaur Land para salvar Peach das garras de Bowser no Super Nintendo.',
  },
  {
    id: 'local-mario-64',
    name: 'Super Mario 64',
    releaseDate: '1996-06-23',
    developer: 'Nintendo EAD',
    genres: ['Platformer'],
    consoleName: 'Nintendo 64',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6a/Super_Mario_64_box_cover.jpg',
    synopsis:
      'Mario explora pinturas no Castelo da Peach em 3D para reunir Power Stars e salvar a princesa.',
  },
  {
    id: 'local-mario-sunshine',
    name: 'Super Mario Sunshine',
    releaseDate: '2002-07-19',
    developer: 'Nintendo EAD',
    genres: ['Platformer'],
    consoleName: 'GameCube',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/7/78/Super_Mario_Sunshine_box.jpg',
    synopsis:
      'Mario usa o FLUDD para limpar Isle Delfino neste platformer ensolarado do GameCube.',
  },
  {
    id: 'local-mario-galaxy',
    name: 'Super Mario Galaxy',
    releaseDate: '2007-11-01',
    developer: 'Nintendo EAD Tokyo',
    genres: ['Platformer'],
    consoleName: 'Wii',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/7/76/SuperMarioGalaxy.jpg',
    synopsis:
      'Mario salta entre planetas em gravidade variável neste aclamado platformer do Wii.',
  },
  {
    id: 'local-mario-odyssey',
    name: 'Super Mario Odyssey',
    releaseDate: '2017-10-27',
    developer: 'Nintendo EPD',
    genres: ['Platformer', 'Adventure'],
    consoleName: 'Nintendo Switch',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8d/Super_Mario_Odyssey.jpg',
    synopsis:
      'Mario viaja pelo mundo com Cappy, capturando inimigos e coletando Power Moons para resgatar Peach.',
  },
  {
    id: 'local-mario-kart8',
    name: 'Mario Kart 8 Deluxe',
    releaseDate: '2017-04-28',
    developer: 'Nintendo EPD',
    genres: ['Racing'],
    consoleName: 'Nintendo Switch',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b5/MarioKart8Boxart.jpg',
    synopsis:
      'Corrida da Nintendo com anti-gravidade, itens clássicos e um elenco enorme de personagens.',
  },
  {
    id: 'local-metroid-prime',
    name: 'Metroid Prime',
    releaseDate: '2002-11-17',
    developer: 'Retro Studios',
    genres: ['Action', 'Adventure', 'Shooter'],
    consoleName: 'GameCube',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/d/de/Metroid_Prime_box.jpg',
    synopsis:
      'Samus Aran explora Tallon IV em primeira pessoa neste clássico do GameCube que redefiniu a série Metroid.',
  },
  {
    id: 'local-pokemon-red',
    name: 'Pokémon Red',
    releaseDate: '1996-02-27',
    developer: 'Game Freak',
    genres: ['RPG'],
    consoleName: 'Game Boy',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Pok%C3%A9mon_Red_Version.jpg',
    synopsis:
      'O início da jornada em Kanto: capture, treine e batalhe para se tornar um Mestre Pokémon no Game Boy.',
  },
  {
    id: 'local-pokemon-gold',
    name: 'Pokémon Gold',
    releaseDate: '1999-11-21',
    developer: 'Game Freak',
    genres: ['RPG'],
    consoleName: 'Game Boy Color',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Pok%C3%A9mon_Gold_Box_Art.jpg',
    synopsis:
      'A segunda geração chega a Johto, com ciclo de dia e noite e 100 novos Pokémon no Game Boy Color.',
  },
  {
    id: 'local-pokemon-emerald',
    name: 'Pokémon Emerald',
    releaseDate: '2004-09-16',
    developer: 'Game Freak',
    genres: ['RPG'],
    consoleName: 'Game Boy Advance',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/6/64/Pokemon_Emerald_Box.jpg',
    synopsis:
      'Versão definitiva de Hoenn, com a Batalha da Fronteira e o confronto entre os times Magma e Aqua.',
  },
  {
    id: 'local-smash-melee',
    name: 'Super Smash Bros. Melee',
    releaseDate: '2001-11-21',
    developer: 'HAL Laboratory',
    genres: ['Fighting'],
    consoleName: 'GameCube',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/7/75/Super_Smash_Bros_Melee_box_art.png',
    synopsis:
      'O mais competitivo Smash da era clássica, com elenco da Nintendo e cena competitiva até hoje.',
  },
  {
    id: 'local-animal-crossing-nh',
    name: 'Animal Crossing: New Horizons',
    releaseDate: '2020-03-20',
    developer: 'Nintendo EPD',
    genres: ['Simulation'],
    consoleName: 'Nintendo Switch',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1f/Animal_Crossing_New_Horizons.jpg',
    synopsis:
      'Construa uma ilha do zero, decore sua casa e viva o cotidiano com os moradores animais da Nintendo.',
  },
  {
    id: 'local-ff7',
    name: 'Final Fantasy VII',
    releaseDate: '1997-01-31',
    developer: 'Square',
    genres: ['RPG'],
    consoleName: 'PlayStation',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c2/Final_Fantasy_VII_Box_Art.jpg',
    synopsis:
      'Cloud, Sephiroth e a luta da AVALANCHE contra a Shinra neste RPG que marcou o PlayStation original.',
  },
  {
    id: 'local-ff10',
    name: 'Final Fantasy X',
    releaseDate: '2001-07-19',
    developer: 'Square',
    genres: ['RPG'],
    consoleName: 'PlayStation 2',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Final_Fantasy_X_Box_Art.jpg',
    synopsis:
      'Tidus e Yuna cruzam Spira contra Sin neste RPG de turnos que estreou vozes e o Sphere Grid no PS2.',
  },
  {
    id: 'local-metal-gear-solid',
    name: 'Metal Gear Solid',
    releaseDate: '1998-09-03',
    developer: 'Konami Computer Entertainment Japan',
    genres: ['Action', 'Stealth'],
    consoleName: 'PlayStation',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/33/Metal_Gear_Solid_PS1_cover.png',
    synopsis:
      'Solid Snake infiltra Shadow Moses nesta obra de Hideo Kojima que popularizou o stealth cinematográfico.',
  },
  {
    id: 'local-metal-gear-solid-3',
    name: 'Metal Gear Solid 3: Snake Eater',
    releaseDate: '2004-11-17',
    developer: 'Konami Computer Entertainment Japan',
    genres: ['Action', 'Stealth'],
    consoleName: 'PlayStation 2',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6f/Metal_Gear_Solid_3_Snake_Eater_Game_Cover.jpg',
    synopsis:
      'Naked Snake sobrevive na selva da Guerra Fria neste prequel aclamado da série Metal Gear.',
  },
  {
    id: 'local-god-of-war',
    name: 'God of War',
    releaseDate: '2005-03-22',
    developer: 'Santa Monica Studio',
    genres: ['Action', 'Adventure'],
    consoleName: 'PlayStation 2',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0a/God_of_War_2005_cover.png',
    synopsis:
      'Kratos enfrenta os deuses do Olimpo nesta ação visceral que se tornou um dos maiores sucessos do PS2.',
  },
  {
    id: 'local-god-of-war-2018',
    name: 'God of War (2018)',
    releaseDate: '2018-04-20',
    developer: 'Santa Monica Studio',
    genres: ['Action', 'Adventure', 'RPG'],
    consoleName: 'PlayStation 4',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/God_of_War_4_cover.jpg',
    synopsis:
      'Kratos e Atreus viajam pelas terras nórdicas nesta reinvenção cinematográfica da saga God of War.',
  },
  {
    id: 'local-shadow-colossus',
    name: 'Shadow of the Colossus',
    releaseDate: '2005-10-18',
    developer: 'Team Ico',
    genres: ['Action', 'Adventure'],
    consoleName: 'PlayStation 2',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Shadow_of_the_Colossus_PS2.jpg',
    synopsis:
      'Wander enfrenta colossos em um mundo vazio e melancólico para trazer uma jovem de volta à vida.',
  },
  {
    id: 'local-crash-1',
    name: 'Crash Bandicoot',
    releaseDate: '1996-09-09',
    developer: 'Naughty Dog',
    genres: ['Platformer'],
    consoleName: 'PlayStation',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/44/Crash_Bandicoot_Cover.png',
    synopsis:
      'O mascote da Naughty Dog estreia pulando por ilhas da Cortex para salvar Tawna no PlayStation.',
  },
  {
    id: 'local-spyro',
    name: 'Spyro the Dragon',
    releaseDate: '1998-09-10',
    developer: 'Insomniac Games',
    genres: ['Platformer', 'Adventure'],
    consoleName: 'PlayStation',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/9/92/Spyro_the_Dragon.jpg',
    synopsis:
      'O dragãozinho Spyro resgata seus semelhantes petrificados neste platformer colorido da Insomniac.',
  },
  {
    id: 'local-gta-vice-city',
    name: 'Grand Theft Auto: Vice City',
    releaseDate: '2002-10-29',
    developer: 'Rockstar North',
    genres: ['Action', 'Adventure', 'Open World'],
    consoleName: 'PlayStation 2',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/ce/Vice-city-cover.jpg',
    synopsis:
      'Tommy Vercetti constrói um império no Miami dos anos 80 neste clássico saturado de neon e rádio.',
  },
  {
    id: 'local-gta-san-andreas',
    name: 'Grand Theft Auto: San Andreas',
    releaseDate: '2004-10-26',
    developer: 'Rockstar North',
    genres: ['Action', 'Adventure', 'Open World'],
    consoleName: 'PlayStation 2',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c4/GTASABOX.jpg',
    synopsis:
      'CJ volta a Los Santos e percorre três cidades neste open world que marcou uma geração no PS2.',
  },
  {
    id: 'local-silent-hill-2',
    name: 'Silent Hill 2',
    releaseDate: '2001-09-24',
    developer: 'Team Silent',
    genres: ['Horror', 'Adventure'],
    consoleName: 'PlayStation 2',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/6/65/Silent_Hill_2.jpg',
    synopsis:
      'James Sunderland entra na cidade de Silent Hill em busca de sua esposa neste marco do terror psicológico.',
  },
  {
    id: 'local-re2',
    name: 'Resident Evil 2',
    releaseDate: '1998-01-21',
    developer: 'Capcom',
    genres: ['Horror', 'Adventure'],
    consoleName: 'PlayStation',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c7/Resident_Evil_2_Cover.png',
    synopsis:
      'Leon e Claire enfrentam o surto de Raccoon City neste clássico de survival horror do PlayStation.',
  },
  {
    id: 'local-re4',
    name: 'Resident Evil 4',
    releaseDate: '2005-01-11',
    developer: 'Capcom',
    genres: ['Horror', 'Shooter', 'Action'],
    consoleName: 'GameCube',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d7/Resident_evil_4_ngc.jpg',
    synopsis:
      'Leon S. Kennedy resgata a filha do presidente em uma vila europeia neste survival horror que reinventou a série.',
  },
  {
    id: 'local-tekken-3',
    name: 'Tekken 3',
    releaseDate: '1997-03-20',
    developer: 'Namco',
    genres: ['Fighting'],
    consoleName: 'PlayStation',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/9/96/Tekken_3_arcade_flyer.jpg',
    synopsis:
      'O auge da era arcade da Namco no PlayStation, com Jin Kazama estreando no torneio da família Mishima.',
  },
  {
    id: 'local-persona-5',
    name: 'Persona 5 Royal',
    releaseDate: '2019-10-31',
    developer: 'P-Studio',
    genres: ['RPG'],
    consoleName: 'PlayStation 4',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b6/Persona_5_Royal_standard_edition.jpg',
    synopsis:
      'Os Phantom Thieves roubam corações corrompidos neste JRPG estilizado da Atlus.',
  },
  {
    id: 'local-last-of-us',
    name: 'The Last of Us',
    releaseDate: '2013-06-14',
    developer: 'Naughty Dog',
    genres: ['Action', 'Adventure'],
    consoleName: 'PlayStation 3',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/46/Video_Game_Cover_-_The_Last_of_Us.jpg',
    synopsis:
      'Joel escolta Ellie por um Estados Unidos devastado neste drama de sobrevivência da Naughty Dog.',
  },
  {
    id: 'local-uncharted-2',
    name: 'Uncharted 2: Among Thieves',
    releaseDate: '2009-10-13',
    developer: 'Naughty Dog',
    genres: ['Action', 'Adventure'],
    consoleName: 'PlayStation 3',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Uncharted_2.jpg',
    synopsis:
      'Nathan Drake persegue Shambhala nesta aventura cinematográfica que elevou o padrão do PS3.',
  },
  {
    id: 'local-bloodborne',
    name: 'Bloodborne',
    releaseDate: '2015-03-24',
    developer: 'FromSoftware',
    genres: ['Action', 'RPG'],
    consoleName: 'PlayStation 4',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/6/68/Bloodborne_Cover_Wallpaper.jpg',
    synopsis:
      'O caçador enfrenta pesadelos góticos em Yharnam neste souls-like exclusivo da FromSoftware.',
  },
  {
    id: 'local-halo-ce',
    name: 'Halo: Combat Evolved',
    releaseDate: '2001-11-15',
    developer: 'Bungie',
    genres: ['Shooter'],
    consoleName: 'Xbox',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/8/80/Halo_-_Combat_Evolved_%28XBox_version_-_box_art%29.jpg',
    synopsis:
      'Master Chief estreia no Xbox original neste FPS que definiu o console da Microsoft.',
  },
  {
    id: 'local-halo-2',
    name: 'Halo 2',
    releaseDate: '2004-11-09',
    developer: 'Bungie',
    genres: ['Shooter'],
    consoleName: 'Xbox',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/9/92/Halo2-cover.png',
    synopsis:
      'A sequência que popularizou o multiplayer online no Xbox Live e expandiu a guerra contra o Covenant.',
  },
  {
    id: 'local-halo-3',
    name: 'Halo 3',
    releaseDate: '2007-09-25',
    developer: 'Bungie',
    genres: ['Shooter'],
    consoleName: 'Xbox 360',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Halo_3_final_boxshot.JPG',
    synopsis:
      'O desfecho da trilogia original de Master Chief, com campanha épica e Forge no Xbox 360.',
  },
  {
    id: 'local-gears',
    name: 'Gears of War',
    releaseDate: '2006-11-07',
    developer: 'Epic Games',
    genres: ['Shooter'],
    consoleName: 'Xbox 360',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bb/Gears_of_War_box_artwork.jpg',
    synopsis:
      'Marcus Fenix enfrenta os Locust neste cover shooter que se tornou o cartão-postal do Xbox 360.',
  },
  {
    id: 'local-fable',
    name: 'Fable',
    releaseDate: '2004-09-14',
    developer: 'Lionhead Studios',
    genres: ['RPG', 'Adventure'],
    consoleName: 'Xbox',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5b/Fablebox.jpg',
    synopsis:
      'O herói de Albion faz escolhas de bem e mal neste RPG carismático do Xbox original.',
  },
  {
    id: 'local-forza-horizon-5',
    name: 'Forza Horizon 5',
    releaseDate: '2021-11-09',
    developer: 'Playground Games',
    genres: ['Racing', 'Open World'],
    consoleName: 'Xbox Series X|S',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/8/86/Forza_Horizon_5_cover_art.jpg',
    synopsis:
      'Festival de corrida em mundo aberto no México, um dos maiores sucessos recentes do Xbox.',
  },
  {
    id: 'local-sonic-2',
    name: 'Sonic the Hedgehog 2',
    releaseDate: '1992-11-24',
    developer: 'Sega Technical Institute',
    genres: ['Platformer'],
    consoleName: 'Genesis / Mega Drive',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/07/Sonic2_US_Genesis_box_art.jpg',
    synopsis:
      'Sonic e Tails enfrentam o Dr. Robotnik neste clássico de 16 bits que introduziu o Super Sonic.',
  },
  {
    id: 'local-streets-of-rage-2',
    name: 'Streets of Rage 2',
    releaseDate: '1992-12-20',
    developer: 'Sega',
    genres: ['Beat em up', 'Action'],
    consoleName: 'Genesis / Mega Drive',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1a/Streets_of_Rage_2_cover.png',
    synopsis:
      'Axel, Blaze e companhia limpam as ruas neste beat \'em up lendário do Mega Drive.',
  },
  {
    id: 'local-phantasy-star-iv',
    name: 'Phantasy Star IV',
    releaseDate: '1993-10-29',
    developer: 'Sega',
    genres: ['RPG'],
    consoleName: 'Genesis / Mega Drive',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8a/Phantasy_Star_IV_cover.jpg',
    synopsis:
      'O auge da série Phantasy Star no Mega Drive, misturando sci-fi, magia e um elenco memorável.',
  },
  {
    id: 'local-shenmue',
    name: 'Shenmue',
    releaseDate: '1999-12-29',
    developer: 'Sega AM2',
    genres: ['Adventure', 'Action'],
    consoleName: 'Dreamcast',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6a/Shenmue_Dreamcast_cover.jpg',
    synopsis:
      'Ryo Hazuki investiga o assassinato do pai neste marco de mundo vivo do Dreamcast.',
  },
  {
    id: 'local-sonic-adventure',
    name: 'Sonic Adventure',
    releaseDate: '1998-12-23',
    developer: 'Sonic Team',
    genres: ['Platformer', 'Adventure'],
    consoleName: 'Dreamcast',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/6/60/Sonic_Adventure.PNG',
    synopsis:
      'A estreia 3D de Sonic no Dreamcast, com várias campanhas e a cidade de Station Square.',
  },
  {
    id: 'local-jet-set-radio',
    name: 'Jet Set Radio',
    releaseDate: '2000-06-29',
    developer: 'Smilebit',
    genres: ['Action', 'Sports'],
    consoleName: 'Dreamcast',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Jet_Set_Radio_cover.jpg',
    synopsis:
      'Patine, pichote e fuja da polícia neste título cel-shaded que virou ícone cultural do Dreamcast.',
  },
  {
    id: 'local-chrono-trigger',
    name: 'Chrono Trigger',
    releaseDate: '1995-03-11',
    developer: 'Square',
    genres: ['RPG'],
    consoleName: 'Super Nintendo / Super Famicom',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Chrono_Trigger.jpg',
    synopsis:
      'Viagem no tempo, múltiplos finais e um dos RPGs mais aclamados da história no Super Nintendo.',
  },
  {
    id: 'local-dkc',
    name: 'Donkey Kong Country',
    releaseDate: '1994-11-21',
    developer: 'Rare',
    genres: ['Platformer'],
    consoleName: 'Super Nintendo / Super Famicom',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Donkey_Kong_Country_SNES_cover.png',
    synopsis:
      'Donkey e Diddy recuperam as bananas roubadas neste platformer da Rare que impressionou o SNES.',
  },
  {
    id: 'local-star-fox-64',
    name: 'Star Fox 64',
    releaseDate: '1997-04-27',
    developer: 'Nintendo EAD',
    genres: ['Shooter'],
    consoleName: 'Nintendo 64',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6d/Star_Fox_64_box.jpg',
    synopsis:
      'Fox McCloud e a equipe Star Fox combatem Andross neste rail shooter com rumble pack no N64.',
  },
  {
    id: 'local-goldeneye',
    name: 'GoldenEye 007',
    releaseDate: '1997-08-25',
    developer: 'Rare',
    genres: ['Shooter'],
    consoleName: 'Nintendo 64',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/36/GoldenEye007box.jpg',
    synopsis:
      'James Bond no Nintendo 64: campanha cinematográfica e o multiplayer local que definiu uma geração.',
  },
  {
    id: 'local-castlevania-sotn',
    name: 'Castlevania: Symphony of the Night',
    releaseDate: '1997-03-20',
    developer: 'Konami',
    genres: ['Action', 'Adventure', 'Platformer'],
    consoleName: 'PlayStation',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/cf/Castlevania_SOTN_PAL.jpg',
    synopsis:
      'Alucard explora um castelo invertido neste metroidvania que redefiniu Castlevania no PlayStation.',
  },
  {
    id: 'local-pitfall',
    name: 'Pitfall!',
    releaseDate: '1982-04-20',
    developer: 'Activision',
    genres: ['Platformer', 'Adventure'],
    consoleName: 'Atari 2600',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Pitfall%21_Coverart.png',
    synopsis:
      'Harry salta por selvas, lagos e tesouros neste platformer pioneiro do Atari 2600.',
  },
  {
    id: 'local-space-invaders',
    name: 'Space Invaders',
    releaseDate: '1980-03-01',
    developer: 'Taito',
    genres: ['Shooter', 'Arcade'],
    consoleName: 'Atari 2600',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0f/Space_Invaders_flyer.jpg',
    synopsis:
      'A conversão do arcade da Taito que ajudou a explodir o mercado de cartuchos do Atari 2600.',
  },
  {
    id: 'local-pac-man-2600',
    name: 'Pac-Man',
    releaseDate: '1982-03-01',
    developer: 'Atari, Inc.',
    genres: ['Arcade'],
    consoleName: 'Atari 2600',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/00/Pac-man.png',
    synopsis:
      'O famoso come-come chegou ao Atari 2600 em uma conversão histórica — e controversa — do arcade.',
  },
];

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const toSearchResult = (game) => ({
  rawgId: game.id,
  name: game.name,
  releaseDate: game.releaseDate,
  developer: game.developer,
  genre: game.genres.join(' / '),
  genres: game.genres,
  coverUrl: game.coverUrl || coverArt(game.name),
  rating: null,
  consoleName: game.consoleName,
  source: 'catalog',
});

const searchLocalConsoleGames = (query, limit = 8) => {
  const needle = normalize(query).trim();
  if (needle.length < 2) return [];

  return catalog
    .map((game) => {
      const name = normalize(game.name);
      const developer = normalize(game.developer);
      const consoleName = normalize(game.consoleName);
      let score = 0;

      if (name === needle) score = 100;
      else if (name.startsWith(needle)) score = 80;
      else if (name.includes(needle)) score = 60;
      else if (developer.includes(needle) || consoleName.includes(needle)) score = 25;

      return { game, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.game.name.localeCompare(b.game.name))
    .slice(0, limit)
    .map(({ game }) => toSearchResult(game));
};

const getLocalConsoleGame = (id) => {
  const game = catalog.find((item) => item.id === id);
  if (!game) return null;

  return {
    ...toSearchResult(game),
    synopsis: game.synopsis,
  };
};

module.exports = {
  searchLocalConsoleGames,
  getLocalConsoleGame,
};
