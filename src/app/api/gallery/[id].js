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

      const image_url = files.picture ? `/uploads/${path.basename(files.picture.path)}` : fields.picture;

      const query = 'UPDATE gallery SET image_url = ? WHERE id_gallery = ?';
      try {
        await db.query(query, [image_url, id]);
        res.status(200).json({ message: 'Picture updated successfully' });
      } catch (error) {
        console.error('Error updating picture:', error);
        res.status(500).json({ message: 'Failed to update picture' });
      }
    });
  } else if (req.method === 'GET') {
    try {
      const query = 'SELECT * FROM gallery WHERE id_gallery = ?';
      const [results] = await db.query(query, [id]);
      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ message: 'Picture not found' });
      }
    } catch (error) {
      console.error('Error fetching picture:', error);
      res.status(500).json({ message: 'Failed to fetch picture' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const query = 'DELETE FROM gallery WHERE id_gallery = ?';
      await db.query(query, [id]);
      res.status(200).json({ message: 'Picture deleted successfully' });
    } catch (error) {
      console.error('Error deleting picture:', error);
      res.status(500).json({ message: 'Failed to delete picture' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
