import { NextResponse } from "next/server";
import pool from "@/utils/dbConfig";
import { nanoid } from "nanoid";
export async function POST(request) {
  try {
    const {
      nama_paket,
      jenis_paket,
      deskripsi,
      nama_destinasi,
      harga,
      durasi,
      availability,
      itinerary,
      inclusion,
      exclusion,
      picture,
    } = await request.json();
    const idTour = nanoid(20);
    const query = {
      text: "INSERT INTO paket_tour (id_tour, nama_paket, jenis_paket, deskripsi, harga, durasi, is_available) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      values: [
        idTour,
        nama_paket,
        jenis_paket,
        deskripsi,
        harga,
        durasi,
        availability,
      ],
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      return NextResponse.json(
        {
          status: 403,
          message: "Failed to add data",
        },
        { status: 403 }
      );
    }

    const idPicture = nanoid(20);
    const query2 = {
      text: "INSERT INTO picture (id_tour, id_picture, image_url) VALUES ($1, $2, $3) RETURNING image_url",
      values: [idTour, idPicture, picture],
    };

    const result2 = await pool.query(query2);
    if (!result2.rowCount) {
      return NextResponse.json(
        {
          status: 403,
          message: "Failed to add picture",
        },
        { status: 403 }
      );
    }

        //Menyimpan destinasi ke tabel paket_tour_destinasi
        const destinasiQueries = nama_destinasi.map(destinasi => ({
          text: "INSERT INTO paket_tour_destinasi (id_tour, id_destinasi) VALUES ($1, $2)",
          values: [idTour, destinasi],
        }));
        await Promise.all(destinasiQueries.map(query => pool.query(query)));
    
        //Menyimpan itinerary
        const itineraryQueries = itinerary.map(item => ({
          text: "INSERT INTO itinerary (id_tour, deskripsi) VALUES ($1, $2)",
          values: [idTour, item],
        }));
        await Promise.all(itineraryQueries.map(query => pool.query(query)));
    
        //Menyimpan inclusion
        const inclusionQueries = inclusion.map(item => ({
          text: "INSERT INTO inclusion (id_tour, deskripsi) VALUES ($1, $2)",
          values: [idTour, item],
        }));
        await Promise.all(inclusionQueries.map(query => pool.query(query)));
    
        //Menyimpan exclusion
        const exclusionQueries = exclusion.map(item => ({
          text: "INSERT INTO exclusion (id_tour, deskripsi) VALUES ($1, $2)",
          values: [idTour, item],
        }));
        await Promise.all(exclusionQueries.map(query => pool.query(query)));
    

    return NextResponse.json(
      {
        status: 200,
        data: {
          ...result.rows[0],
          picture: result2.rows[0].img_url,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const jenis_paket = searchParams.get("jenis_paket");
    const custom = searchParams.get("custom");

    if (id) {
      const query = "SELECT * FROM paket_tour WHERE id_tour = $1";
      const { rows: paket } = await pool.query(query, [id]);
      const query2 = "SELECT * FROM picture WHERE id_tour = $1";
      const { rows: picture } = await pool.query(query2, [id]);
      const query3 = "SELECT id_destinasi FROM paket_tour_destinasi WHERE id_tour = $1";
      const { rows: destinasi } = await pool.query(query3, [id]);
      const query4 = "SELECT deskripsi FROM itinerary WHERE id_tour = $1";
      const { rows: itinerary } = await pool.query(query4, [id]);
      const query5 = "SELECT deskripsi FROM inclusion WHERE id_tour = $1";
      const { rows: inclusion } = await pool.query(query5, [id]);
      const query6 = "SELECT deskripsi FROM exclusion WHERE id_tour = $1";
      const { rows: exclusion } = await pool.query(query6, [id]);
      return NextResponse.json(
        {
          status: 200,
          data: {
            ...paket[0],
            picture: picture.length>0? picture[0].image_url : null,
            nama_destinasi: destinasi.map(d => d.id_destinasi),
            itinerary: itinerary.map(i => i.deskripsi),
            inclusion: inclusion.map(i => i.deskripsi),
            exclusion: exclusion.map(e => e.deskripsi),
          },
        },
        { status: 200 }
      );
    } else if (jenis_paket) {
      const query = "SELECT * FROM paket_tour WHERE jenis_paket = $1 AND created_by IS NULL";
      const { rows: paket } = await pool.query(query, [jenis_paket]);

      const paketIds = paket.map((p) => p.id_tour);
      const pictureQuery =
        "SELECT * FROM picture WHERE id_tour = ANY($1::text[])";
      const { rows: pictures } = await pool.query(pictureQuery, [paketIds]);

      const paketWithPictures = paket.map((p) => ({
        ...p,
        picture:
          pictures.find((pic) => pic.id_tour === p.id_tour)?.image_url || null,
      }));

      return NextResponse.json(
        {
          status: 200,
          data: paketWithPictures,
        },
        { status: 200 }
      );
    } else if(custom === "true"){
      const query = "SELECT * FROM paket_tour WHERE created_by IS NOT NULL";
      const { rows: paket } = await pool.query(query);
      const paketIds = paket.map((p) => p.id_tour);
      const pictureQuery =
        "SELECT * FROM picture WHERE id_tour = ANY($1::text[])";
      const { rows: pictures } = await pool.query(pictureQuery, [paketIds]);

      const paketWithPictures = paket.map((p) => ({
        ...p,
        picture:
          pictures.find((pic) => pic.id_tour === p.id_tour)?.image_url || null,
      }));
      return NextResponse.json(
        {
          status: 200,
          data: paketWithPictures,
        },
        { status: 200 }
      );
    }else {
      const query = "SELECT * FROM paket_tour WHERE created_by IS NULL";
      const { rows: paket } = await pool.query(query);
      const paketIds = paket.map((p) => p.id_tour);
      const pictureQuery =
        "SELECT * FROM picture WHERE id_tour = ANY($1::text[])";
      const { rows: pictures } = await pool.query(pictureQuery, [paketIds]);

      const paketWithPictures = paket.map((p) => ({
        ...p,
        picture:
          pictures.find((pic) => pic.id_tour === p.id_tour)?.image_url || null,
      }));
      return NextResponse.json(
        {
          status: 200,
          data: paketWithPictures,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); 

  const query = {
    text: 'DELETE FROM picture WHERE id_tour = $1 RETURNING *',
    values: [id]
  }

  const query2 = {
    text: 'DELETE FROM paket_tour WHERE id_tour = $1 RETURNING *',
    values: [id]
  }

  const query3 = {
    text: 'DELETE FROM itinerary WHERE id_tour = $1 RETURNING *',
    values: [id]
  }

  const query4 = {
    text: 'DELETE FROM inclusion WHERE id_tour = $1 RETURNING *',
    values: [id]
  }

  const query5 = {
    text: 'DELETE FROM exclusion WHERE id_tour = $1 RETURNING *',
    values: [id]
  }

  const query6 = {
    text: 'DELETE FROM paket_tour_destinasi WHERE id_tour = $1 RETURNING *',
    values: [id]
  }
  const result = await pool.query(query);
  if(!result.rowCount){
    return NextResponse.json({
      status: 403,
      message: "Failed to delete picture"
    }, {status: 403})
  }
  const result2 = await pool.query(query2);
  if (!result2.rowCount) {
    return NextResponse.json(
      {
        status: 403,
        message: "Failed to delete data",
      },
      { status: 403 }
    );
  }
  
  const result3 = await pool.query(query3);
  if (!result3.rowCount) {
    return NextResponse.json({
      status: 403,
      message: "Failed to delete itinerary"
    }, { status: 403 });
  }

  const result4 = await pool.query(query4);
  if (!result4.rowCount) {
    return NextResponse.json({
      status: 403,
      message: "Failed to delete inclusion"
    }, { status: 403 });
  }

  const result5 = await pool.query(query5);
  if (!result5.rowCount) {
    return NextResponse.json({
      status: 403,
      message: "Failed to delete exclusion"
    }, { status: 403 });
  }

  const result6 = await pool.query(query6);
  if (!result6.rowCount) {
    return NextResponse.json({
      status: 403,
      message: "Failed to delete package tour destination data"
    }, { status: 403 });
  }

  return NextResponse.json({
    status: 200,
    deletedData: result2.rows[0],
  });
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({
        status: 403,
        message: "Bad Request",
      });
    }

    const {
      nama_paket,
      jenis_paket,
      deskripsi,
      nama_destinasi,
      harga,
      durasi,
      availability,
      itinerary,
      inclusion,
      exclusion,
      picture,
    } = await request.json();
    const query = {
      text: "UPDATE paket_tour SET nama_paket = $1, jenis_paket = $2, deskripsi = $3, harga = $4, durasi = $5, is_available = $6 WHERE id_tour = $7 RETURNING *",
      values: [
        nama_paket,
        jenis_paket,
        deskripsi,
        harga,
        durasi,
        availability,
        id,
      ],
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      return NextResponse.json({
        status: 403,
        message: "Failed to update data",
      });
    }
    const query2 = {
      text: "UPDATE picture SET image_url = $1 WHERE id_tour = $2 RETURNING *",
      values: [picture, id],
    };

    const result2 = await pool.query(query2);
    if (!result2.rowCount) {
      const idPicture = nanoid(20);
      const query = {
        text: "INSERT INTO picture (id_tour, id_picture, image_url) VALUES ($1, $2, $3) RETURNING image_url",
        values: [id, idPicture, picture],
      };
      const result = await pool.query(query);
      return NextResponse.json({
        status: 403,
        message: "Failed to update picture",
      });
    }

        // Update destinasi
        const query3 = {
          text: "DELETE FROM paket_tour_destinasi WHERE id_tour = $1 RETURNING *",
          values: [id],
        };
        await pool.query(query3);

        // insert multiple data
        let addedDestination = {rows:[]};
        if(nama_destinasi.length > 0) {
          const destinationsValues = nama_destinasi.map((destinasi) => [destinasi, id]);
          const insertDestinasiQuery = {
            text: `INSERT INTO paket_tour_destinasi (id_destinasi, id_tour) 
            VALUES ${destinationsValues.map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`).join(', ')} 
            RETURNING id_destinasi`,
            values: destinationsValues.flat(),
          };
          addedDestination = await pool.query(insertDestinasiQuery);
        }

        // Update itinerary
        const query4 = {
          text: "DELETE FROM itinerary WHERE id_tour = $1 RETURNING *",
          values: [id],
        };
        await pool.query(query4);

        let addedItinerary = {rows:[]};
        if(itinerary.length > 0) {
          const itineraryValues = itinerary.map((item) => [item, id]);
          const insertItineraryQuery = {
            text: `INSERT INTO itinerary (deskripsi, id_tour) 
            VALUES ${itineraryValues.map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`).join(', ')} 
            RETURNING *`,
            values: itineraryValues.flat(),
          };
          addedItinerary = await pool.query(insertItineraryQuery);
        }
     
        // // Update inclusion
        const query5 = {
          text: "DELETE FROM inclusion WHERE id_tour = $1 RETURNING *",
          values: [id],
        };
        await pool.query(query5);
        
        let addedInclusion = {rows:[]};
        if(inclusion.length > 0) {
          const inclusionValues = inclusion.map((item) => [item, id]);
          const insertInclusionQuery = {
            text: `INSERT INTO inclusion (deskripsi, id_tour) 
            VALUES ${inclusionValues.map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`).join(', ')} 
            RETURNING *`,
            values: inclusionValues.flat(),
          };
          addedInclusion = await pool.query(insertInclusionQuery);
        }
    
        // // Update exclusion
        const query6 = {
          text: "DELETE FROM exclusion WHERE id_tour = $1 RETURNING *",
          values: [id],
        };
        await pool.query(query6);
        
        let addedExclusion = {rows:[]};
        if(exclusion.length > 0) {
          const exclusionValues = exclusion.map((item) => [item, id]);
          const insertExclusionQuery = {
            text: `INSERT INTO exclusion (deskripsi, id_tour) 
            VALUES ${exclusionValues.map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`).join(', ')} 
            RETURNING *`,
            values: exclusionValues.flat(),
          };
          addedExclusion = await pool.query(insertExclusionQuery);
        }
    
    return NextResponse.json({
      status: 200,
      updatedData: {
        ...result.rows[0],
        nama_destinasi: addedDestination.rows.length? addedDestination.rows.map((dest) => dest.id_destinasi):[],
        itinerary: addedItinerary.rows.length? addedItinerary.rows.map((item) => item.deskripsi):[],
        inclusion: addedInclusion.rows.length? addedInclusion.rows.map((item) => item.deskripsi):[],
        exclusion: addedExclusion.rows.length? addedExclusion.rows.map((item) => item.deskripsi):[],
        picture: result2.rows.length > 0 ? result2.rows[0].image_url : null,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}