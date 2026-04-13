const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const pool     = require('../config/db');
const nodemailer = require('nodemailer');

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// POST /api/auth/register
const register = async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password)
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  if (password.length < 6)
    return res.status(400).json({ error: 'La contraseña debe tener mínimo 6 caracteres.' });

  try {
    const [existing] = await pool.query('SELECT id_usuario FROM usuarios WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ error: 'Email ya registrado.' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?,?,?,?)',
      [nombre, email, hash, 'user']
    );

    mailer.sendMail({
      from: 'Red Wire Auto <noreply@redwire.auto>',
      to: email,
      subject: '¡Bienvenido a Red Wire Auto!',
      html: `<div style="font-family:sans-serif"><h2 style="color:#BE3D3D">Red Wire Auto</h2>
             <p>Hola <strong>${nombre}</strong>, tu cuenta está lista. ¡Encuentra tu coche ideal!</p></div>`,
    }).catch(e => console.warn('Email warning:', e.message));

    const token = jwt.sign(
      { id: result.insertId, nombre, email, rol: 'user' },
      process.env.JWT_SECRET, { expiresIn: '7d' }
    );
    res.status(201).json({ token, user: { id: result.insertId, nombre, email, rol: 'user' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña obligatorios.' });

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password)))
      return res.status(401).json({ error: 'Credenciales incorrectas.' });

    const u = rows[0];
    const token = jwt.sign(
      { id: u.id_usuario, nombre: u.nombre, email: u.email, rol: u.rol },
      process.env.JWT_SECRET, { expiresIn: '7d' }
    );
    res.json({ token, user: { id: u.id_usuario, nombre: u.nombre, email: u.email, rol: u.rol } });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { register, login };