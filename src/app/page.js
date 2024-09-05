import { pool } from "@/utils/dbConnect";
import dbConnect from "@/utils/dbConnect";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  // the default export function of the page component, which serves as the main entry point for rendering the page.
  dbConnect(); // ensure the database connection is established
  //CREATE
  async function createNote(data) {
    "use server"; //to be executed on the server.
    let note = data.get("note")?.valueOf();
    let date = data.get("date")?.valueOf();
    //data, is a FormData object passed by the form submission, containing the user's input.
    //note and date: The function extracts the values of the note and date fields from the form data.

    //try-catch block: This handles the database operation.
    try {
      const newNote = await pool.query(
        //pool: This refers to a connection pool that you’ve created using a PostgreSQL client (likely pg library).
        //A connection pool is a cache of database connections that can be reused, which helps manage multiple queries efficiently.
        //The result of the pool.query() is stored in the newNote variable.
        //await: This keyword pauses the execution of the async function until the pool.query() promise is resolved. This means the function waits for the database operation to complete before moving on.
        //pool.query: A database query is executed to insert the note and date into table1.

        "INSERT INTO table1 (note, date) VALUES ($1, $2) RETURNING *",
        //$1 and $2: This specifies the values to be inserted into the respective columns. These are placeholders for the note and date values, which are safely passed to prevent SQL injection.
        //RETURNING *: This returns the newly inserted row.
        [note, date]
        //This array contains the actual values that will replace the placeholders $1 and $2 in the SQL command.
      );
      console.log(newNote.rows[0]); //console.log(newNote.rows[0]): Logs the newly created note.
    } catch (err) {
      console.log(err);
    }
    redirect("/"); //Redirects the user back to the homepage after the note is created.
  }

  //READ
  const data = await pool.query("SELECT * FROM table1");
  const result = data.rows;

  //DELETE
  async function deleteNote(data) {
    "use server";
    let id = data.get("id").valueOf();
    //data.get("id"): The data object is typically a FormData instance, and get("id") retrieves the value associated with the key "id" from the form data.
    //.valueOf(): Converts the retrieved id to its primitive value, ensuring it’s in the correct format (e.g., a string or number).

    try {
      await pool.query("DELETE FROM table1 WHERE id = $1", [id]);
      //await: Pauses the execution of the function until the promise returned by pool.query() is resolved.
      // WHERE id = $1: Specifies the condition that the id column of the row must match the value provided in the placeholder $1 for the row to be deleted.
      // [id]: The id retrieved from the form data is passed in as the value for the placeholder $1 in the SQL query. This ensures that only the note with the specified id is deleted.

      console.log(" note deleted");
    } catch (error) {
      console.log(error);
    }
    redirect("/");
  }

  return (
    <main className="m-10">
      <div className="m-5">
        <h1 className="text-center m-5">Add note</h1>
        <form action={createNote} className="space-y-5">
          <input
            type="text"
            name="note"
            id="note"
            placeholder="Add note"
            className="text-black shadow-lg rounded-md shadow-black h-10 p-3 w-[100%]"
          />
          <input
            type="date"
            name="date"
            id="date"
            placeholder="Add date"
            className="text-black shadow-lg rounded-md shadow-black h-10 p-3 w-[100%]"
          />
          <button
            type="submit"
            className="bg-orange-500 font-bold text-white hover:bg-red-600 p-3 rounded-md shadow-lg shadow-orange-400 hover:shadow-red-400"
          >
            SUBMIT
          </button>
        </form>
      </div>

      {result.map((element) => {
        //result.map: Iterates over each element in result, generating a list for each note.
        return (
          <>
            <ul className="flex my-2">
              <li className="text-center w-[50%]">{element.note}</li>
              <li className="text-center w-[30%]">{element.date}</li>
              <li className=" flex text-center w-[20%]">
                <Link href={"/edit/" + element.id}>
                  <button className="bg-cyan-600 font-bold text-white p-2 mx-2 rounded-md shadow-lg shadow-cyan-400">
                    EDIT
                  </button>
                </Link>
                <form action={deleteNote}>
                  <input type="hidden" name="id" value={element.id} />
                  <button
                    className="bg-red-600 font-bold text-white p-2 rounded-md shadow-lg shadow-red-400"
                    type="submit"
                  >
                    DELETE
                  </button>
                </form>
              </li>
            </ul>
          </>
        );
      })}
    </main>
  );
}
