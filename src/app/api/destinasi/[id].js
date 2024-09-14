import { db } from '@/utils/dbConfig';
import formidable from 'formidable';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), 'public/uploads');
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to parse form' });
      }

      const picture = files.picture ? `/uploads/${path.basename(files.picture.path)}` : fields.picture;

      const { nama_destinasi, deskripsi, harga, jenis_destinasi } = fields;
      const query = 'UPDATE destinasi SET nama_destinasi = ?, deskripsi = ?, harga = ?, jenis_destinasi = ?, picture = ? WHERE id_destinasi = ?';
      try {
        await db.query(query, [nama_destinasi, deskripsi, harga, jenis_destinasi, picture, id]);
        res.status(200).json({ message: 'Destinasi updated successfully' });
      } catch (error) {
        console.error('Error updating destination:', error);
        res.status(500).json({ message: 'Failed to update destination' });
      }
    });
  } else if (req.method === 'GET') {
    try {
      const query = 'SELECT * FROM destinasi WHERE id_destinasi = ?';
      const [results] = await db.query(query, [id]);
      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ message: 'Destinasi not found' });
      }
    } catch (error) {
      console.error('Error fetching destination:', error);
      res.status(500).json({ message: 'Failed to fetch destination' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const query = 'DELETE FROM destinasi WHERE id_destinasi = ?';
      await db.query(query, [id]);
      res.status(200).json({ message: 'Destinasi deleted successfully' });
    } catch (error) {
      console.error('Error deleting destination:', error);
      res.status(500).json({ message: 'Failed to delete destination' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
