import { pool } from "@/utils/dbConnect";
import dbConnect from "@/utils/dbConnect";
import { redirect } from "next/navigation";

export default async function edit({ params }) {
  dbConnect();
  const id = params.id;
  const data = await pool.query("SELECT * FROM table1 WHERE id = $1", [id]);
  //[id]: This array provides the value for the $1 placeholder in the SQL query.
  const result = data.rows[0];
  //After querying the database, data.rows contains all matching rows. Since you're fetching a single row by id, data.rows[0] gives you the first (and only) result.

  async function updateNote(data) {
    "use server";
    let note = data.get("note").valueOf();
    let date = data.get("date").valueOf();

    try {
      const updatedNote = await pool.query(
        `UPDATE table1 SET note = $1, date = $2 WHERE id = $3`,
        //SQL query that updates the note and date columns for the row with the given id.
        [note, date, id]
        //Provides the values for the placeholders $1, $2, and $3 in the SQL query.
      );
      console.log("note update", updatedNote);
    } catch (err) {
      console.error("error in update");
    }
    redirect("/");
  }
  return (
    <main className="m-10">
      <div className="m-5">
        <h1 className="text-center m-5">Edit note</h1>
        <form action={updateNote} className="space-y-5">
          <input
            type="text"
            name="note"
            id="note"
            placeholder="Add note"
            defaultValue={result.note}
            className="text-black shadow-lg rounded-md shadow-black h-10 p-3 w-[100%]"
          />
          <input
            type="date"
            name="date"
            id="date"
            placeholder="Add date"
            defaultValue={result.date}
            className="text-black shadow-lg rounded-md shadow-black h-10 p-3 w-[100%]"
          />
          <button
            type="submit"
            className="bg-orange-500 font-bold text-white hover:bg-red-600 p-3 rounded-md"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </main>
  );
}
