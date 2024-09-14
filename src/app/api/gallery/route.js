/* import { NextResponse } from 'next/server';
import pool from '@/utils/dbConfig';
import { nanoid } from 'nanoid';

export async function POST(request) {
  try {
    const { image_url } = await request.json();
    const idGallery = nanoid(20);

    const query = {
      text: 'INSERT INTO gallery (id_gallery, image_url) VALUES ($1, $2) RETURNING *',
      values: [idGallery, image_url]
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      return NextResponse.json({
        status: 403,
        message: "Failed to add picture"
      }, { status: 403 });
    }

    return NextResponse.json({
      status: 200,
      data: {
        ...result.rows[0],
        picture: result.rows[0].image_url
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error adding picture:', error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error"
    }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = 8;
  const offset = (page - 1) * limit;

  try {
    const totalQuery = 'SELECT COUNT(*) FROM gallery';
    const totalResult = await pool.query(totalQuery);
    const total = parseInt(totalResult.rows[0].count);

    const query = {
      text: 'SELECT * FROM gallery ORDER BY id_gallery LIMIT $1 OFFSET $2',
      values: [limit, offset]
    };
    const { rows: pictures } = await pool.query(query);

    return NextResponse.json({
      status: 200,
      data: pictures.map((row) => ({
        ...row,
        picture: row.image_url
      })),
      total
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching pictures:', error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error"
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const query = {
    text: 'DELETE FROM gallery WHERE id_gallery = $1 RETURNING *',
    values: [id]
  };

  try {
    const result = await pool.query(query);
    if (!result.rowCount) {
      return NextResponse.json({
        status: 403,
        message: "Failed to delete picture"
      }, { status: 403 });
    }

    return NextResponse.json({
      status: 200,
      deletedData: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting picture:', error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error"
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, image_url } = await request.json();

    const updatePictureQuery = {
      text: 'UPDATE gallery SET image_url = $2 WHERE id_gallery = $1 RETURNING *',
      values: [id, image_url]
    };

    const result = await pool.query(updatePictureQuery);
    if (!result.rowCount) {
      return NextResponse.json({
        status: 403,
        message: "Failed to update picture"
      }, { status: 403 });
    }

    return NextResponse.json({
      status: 200,
      data: {
        ...result.rows[0],
        picture: result.rows[0].image_url
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating picture:', error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error"
    }, { status: 500 });
  }
} */

  import { NextResponse } from 'next/server';
  import pool from '@/utils/dbConfig';
  import { nanoid } from 'nanoid';
  
  export async function POST(request) {
    try {
      const { nama_gallery, image_url } = await request.json();
      const idGallery = nanoid(20);
  
      const query = {
        text: 'INSERT INTO gallery (id_gallery, nama_gallery, image_url) VALUES ($1, $2, $3) RETURNING *',
        values: [idGallery, nama_gallery, image_url]
      };
  
      const result = await pool.query(query);
      if (!result.rowCount) {
        return NextResponse.json({
          status: 403,
          message: "Failed to add picture"
        }, { status: 403 });
      }
  
      return NextResponse.json({
        status: 200,
        data: {
          ...result.rows[0],
          picture: result.rows[0].image_url
        }
      }, { status: 200 });
    } catch (error) {
      console.error('Error adding picture:', error);
      return NextResponse.json({
        status: 500,
        message: "Internal Server Error"
      }, { status: 500 });
    }
  }
  
  export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 5;
    const offset = (page - 1) * limit;
  
    try {
      const totalQuery = 'SELECT COUNT(*) FROM gallery';
      const totalResult = await pool.query(totalQuery);
      const total = parseInt(totalResult.rows[0].count);
  
      const query = {
        text: 'SELECT * FROM gallery ORDER BY id_gallery LIMIT $1 OFFSET $2',
        values: [limit, offset]
      };
      const { rows: pictures } = await pool.query(query);
  
      return NextResponse.json({
        status: 200,
        data: pictures.map((row) => ({
          ...row,
          picture: row.image_url
        })),
        total
      }, { status: 200 });
    } catch (error) {
      console.error('Error fetching pictures:', error);
      return NextResponse.json({
        status: 500,
        message: "Internal Server Error"
      }, { status: 500 });
    }
  }
  
  export async function PUT(request) {
    try {
      const { id, nama_gallery, image_url } = await request.json();
  
      const updatePictureQuery = {
        text: 'UPDATE gallery SET nama_gallery = $2, image_url = $3 WHERE id_gallery = $1 RETURNING *',
        values: [id, nama_gallery, image_url]
      };
      
    const updateResult = await pool.query(updatePictureQuery);
    if (!updateResult.rowCount) {
      return NextResponse.json({
        status: 404,
        message: "Picture not found"
      }, { status: 404 });
    }
 
    return NextResponse.json({
      status: 200,
      data: updateResult.rows[0]
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating picture:', error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error"
    }, { status: 500 });
  } 
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const deleteQuery = {
      text: 'DELETE FROM gallery WHERE id_gallery = $1 RETURNING *',
      values: [id]
    };

    const result = await pool.query(deleteQuery);
    if (!result.rowCount) {
      return NextResponse.json({
        status: 404,
        message: "Gallery not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      status: 200,
      message: "Gallery successfully deleted",
      deletedData: result.rows[0]
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error"
    }, { status: 500 });
  }
}