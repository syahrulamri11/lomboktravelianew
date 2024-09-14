import { users } from '../../../../data/users';

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(users);
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    const index = users.findIndex(u => u.id_user === id);
    if (index !== -1) {
      users.splice(index, 1);
      res.status(200).json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else if (req.method === 'POST') {
    const { nama, email, password } = req.body;
    const newUser = {
      id_user: (Math.random() + 1).toString(36).substring(2), // Generate random id
      nama,
      email,
      password
    };
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
