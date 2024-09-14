// import { NextResponse } from 'next/server';
// import pool from '@/utils/dbConfig';
// import { nanoid } from 'nanoid';

// export async function POST(request) {
//   try {
//     const { nama_destinasi, jenis_destinasi, deskripsi, harga, picture } = await request.json();
//     const idDestinasi = nanoid(20);

//     const query = {
//       text: 'INSERT INTO destinasi (id_destinasi, nama_destinasi, jenis_destinasi, deskripsi, harga) VALUES ($1, $2, $3, $4, $5) RETURNING *',
//       values: [idDestinasi, nama_destinasi, jenis_destinasi, deskripsi, harga]
//     };

//     const result = await pool.query(query);
//     if (!result.rowCount) {
//       return NextResponse.json({
//         status: 403,
//         message: "Failed to add data"
//       }, { status: 403 });
//     }

//     const idPictureDestination = nanoid(20);
//     const query2 = {
//       text: 'INSERT INTO picture_destination (id_picture_destination, id_destinasi, image_url) VALUES ($1, $2, $3) RETURNING image_url',
//       values: [idPictureDestination, idDestinasi, picture]
//     };

//     const result2 = await pool.query(query2);
//     if (!result2.rowCount) {
//       return NextResponse.json({
//         status: 403,
//         message: "Failed to add picture"
//       }, { status: 403 });
//     }

//     return NextResponse.json({
//       status: 200,
//       data: {
//         ...result.rows[0],
//         picture: result2.rows[0].img_url
//       }
//     }, { status: 200 });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({
//       status: 500,
//       message: "Internal Server Error"
//     }, { status: 500 });
//   }
// }

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");
//     if (id) {
//       const query = 'SELECT * FROM destinasi WHERE id_destinasi = $1';
//       const { rows: destinasi } = await pool.query(query, [id]);
//       const query2 = 'SELECT * FROM picture_destination WHERE id_destinasi = $1';
//       const { rows: picture } = await pool.query(query2, [id]);
//       return NextResponse.json({
//         status: 200,
//         data: {
//           ...destinasi[0],
//           picture: picture.length > 0 ? picture[0].image_url : null
//         }
//       }, { status: 200 });
//     } else {
//       const query = 'SELECT * FROM destinasi';
//       const { rows: destinasi } = await pool.query(query);
//       return NextResponse.json({
//         status: 200,
//         data: destinasi,
//       }, { status: 200 });
//     }
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({
//       status: 500,
//       message: "Internal Server Error"
//     }, { status: 500 });
//   }
// }

// export async function DELETE(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");

//     const query = {
//       text: 'DELETE FROM picture_destination WHERE id_destinasi = $1 RETURNING *',
//       values: [id]
//     };

//     const query2 = {
//       text: 'DELETE FROM destinasi WHERE id_destinasi = $1 RETURNING *',
//       values: [id]
//     };

//     const result = await pool.query(query);
//     if (!result.rowCount) {
//       return NextResponse.json({
//         status: 403,
//         message: "Failed to delete picture"
//       }, { status: 403 });
//     }
//     const result2 = await pool.query(query2);
//     if (!result2.rowCount) {
//       return NextResponse.json({
//         status: 403,
//         message: "Failed to delete data"
//       }, { status: 403 });
//     }

//     return NextResponse.json({
//       status: 200,
//       deletedData: {
//         ...result2.rows[0],
//         picture: result.rows.length > 0 ? result.rows[0] : null
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({
//       status: 500,
//       message: "Internal Server Error"
//     }, { status: 500 });
//   }
// }

// export async function PUT(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");
//     if (!id) {
//       return NextResponse.json({
//         status: 403,
//         message: 'Bad Request',
//       }, { status: 403 });
//     }

//     const { nama_destinasi, jenis_destinasi, deskripsi, harga, picture } = await request.json();
//     const query = {
//       text: 'UPDATE destinasi SET nama_destinasi = $1, jenis_destinasi = $2, deskripsi = $3, harga = $4 WHERE id_destinasi = $5 RETURNING *',
//       values: [nama_destinasi, jenis_destinasi, deskripsi, harga, id]
//     };

//     const result = await pool.query(query);
//     if (!result.rowCount) {
//       return NextResponse.json({
//         status: 403,
//         message: "Failed to update data"
//       }, { status: 403 });
//     }

//     const query2 = {
//       text: 'UPDATE picture_destination SET image_url = $1 WHERE id_destinasi = $2 RETURNING *',
//       values: [picture, id]
//     };

//     const result2 = await pool.query(query2);
//     if (!result2.rowCount) {
//       return NextResponse.json({
//         status: 403,
//         message: "Failed to update picture"
//       }, { status: 403 });
//     }

//     return NextResponse.json({
//       status: 200,
//       updatedData: {
//         ...result.rows[0],
//         picture: result2.rows.length > 0 ? result2.rows[0].image_url : null
//       }
//     }, { status: 200 });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({
//       status: 500,
//       message: "Internal Server Error"
//     }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import pool from '@/utils/dbConfig';
import { nanoid } from 'nanoid';

export async function POST(request) {
  try {
    const { nama_destinasi, jenis_destinasi, deskripsi, harga, picture } = await request.json();
    const idDestinasi = nanoid(20);

    const query = {
      text: 'INSERT INTO destinasi (id_destinasi, nama_destinasi, jenis_destinasi, deskripsi, harga) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      values: [idDestinasi, nama_destinasi, jenis_destinasi, deskripsi, harga]
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      return NextResponse.json({
        status: 403,
        message: "Failed to add data"
      }, { status: 403 });
    }

    const idPictureDestination = nanoid(20);
    const query2 = {
      text: 'INSERT INTO picture_destination (id_picture_destination, id_destinasi, image_url) VALUES ($1, $2, $3) RETURNING image_url',
      values: [idPictureDestination, idDestinasi, picture]
    };

    const result2 = await pool.query(query2);
    if (!result2.rowCount) {
      return NextResponse.json({
        status: 403,
        message: "Failed to add picture"
      }, { status: 403 });
    }

    return NextResponse.json({
      status: 200,
      data: {
        ...result.rows[0],
        picture: result2.rows[0].image_url
      }
    }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error"
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const jenis_destinasi = searchParams.get("jenis_destinasi"); // Ambil parameter jenis_destinasi dari query

    if (id) {
      // Jika ID destinasi disediakan, ambil data destinasi dan gambarnya
      const query = 'SELECT * FROM destinasi WHERE id_destinasi = $1';
      const { rows: destinasi } = await pool.query(query, [id]);
      const query2 = 'SELECT * FROM picture_destination WHERE id_destinasi = $1';
      const { rows: picture } = await pool.query(query2, [id]);
      return NextResponse.json({
        status: 200,
        data: {
          ...destinasi[0],
          picture: picture.length > 0 ? picture[0].image_url : null
        }
      }, { status: 200 });
    } else if (jenis_destinasi) {
      // Jika jenis_destinasi disediakan, ambil data destinasi dengan jenis yang sesuai
      const query = 'SELECT * FROM destinasi WHERE jenis_destinasi = $1';
      const { rows: destinasi } = await pool.query(query, [jenis_destinasi]);
      const destinasiIds = destinasi.map(dest => dest.id_destinasi);
      
      // Ambil gambar untuk semua destinasi dengan jenis yang sesuai
      const query2 = 'SELECT * FROM picture_destination WHERE id_destinasi = ANY($1::text[])';
      const { rows: pictures } = await pool.query(query2, [destinasiIds]);
      
      // Gabungkan data destinasi dengan gambar yang sesuai
      const destinasiWithPictures = destinasi.map(dest => ({
        ...dest,
        picture: pictures.find(pic => pic.id_destinasi === dest.id_destinasi)?.image_url || null
      }));
      
      return NextResponse.json({
        status: 200,
        data: destinasiWithPictures
      }, { status: 200 });
    } else {
      // Jika tidak ada filter, ambil semua data destinasi
      const query = 'SELECT * FROM destinasi';
      const { rows: destinasi } = await pool.query(query);
      return NextResponse.json({
        status: 200,
        data: destinasi
      }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error"
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const query = {
      text: 'DELETE FROM picture_destination WHERE id_destinasi = $1 RETURNING *',
      values: [id]
    };

    const query2 = {
      text: 'DELETE FROM destinasi WHERE id_destinasi = $1 RETURNING *',
      values: [id]
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      return NextResponse.json({
        status: 403,
        message: "Failed to delete picture"
      }, { status: 403 });
    }
    const result2 = await pool.query(query2);
    if (!result2.rowCount) {
      return NextResponse.json({
        status: 403,
        message: "Failed to delete data"
      }, { status: 403 });
    }

    return NextResponse.json({
      status: 200,
      deletedData: {
        ...result2.rows[0],
        picture: result.rows.length > 0 ? result.rows[0] : null
      }
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error"
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({
        status: 403,
        message: 'Bad Request',
      }, { status: 403 });
    }

    const { nama_destinasi, jenis_destinasi, deskripsi, harga, picture } = await request.json();
    const query = {
      text: 'UPDATE destinasi SET nama_destinasi = $1, jenis_destinasi = $2, deskripsi = $3, harga = $4 WHERE id_destinasi = $5 RETURNING *',
      values: [nama_destinasi, jenis_destinasi, deskripsi, harga, id]
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      return NextResponse.json({
        status: 403,
        message: "Failed to update data"
      }, { status: 403 });
    }

    const query2 = {
      text: 'UPDATE picture_destination SET image_url = $1 WHERE id_destinasi = $2 RETURNING *',
      values: [picture, id]
    };

    const result2 = await pool.query(query2);
    if (!result2.rowCount) {
      return NextResponse.json({
        status: 403,
        message: "Failed to update picture"
      }, { status: 403 });
    }

    return NextResponse.json({
      status: 200,
      updatedData: {
        ...result.rows[0],
        picture: result2.rows.length > 0 ? result2.rows[0].image_url : null
      }
    }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error"
    }, { status: 500 });
  }
}
