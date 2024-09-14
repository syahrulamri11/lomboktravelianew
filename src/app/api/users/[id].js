import { users } from '../../../../data/users';

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const user = users.find(u => u.id_user === id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else if (req.method === 'PUT') {
    const { nama, email } = req.body;
    const user = users.find(u => u.id_user === id);
    if (user) {
      user.nama = nama;
      user.email = email;
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else if (req.method === 'DELETE') {
    const index = users.findIndex(u => u.id_user === id);
    if (index !== -1) {
      users.splice(index, 1);
      res.status(200).json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
