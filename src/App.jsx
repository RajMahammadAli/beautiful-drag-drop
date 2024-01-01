import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
// import { StrictModeDroppable as Droppable } from "./helper/StrictDroppableMode";

function App() {
  const [todo, setTodo] = useState("");
  const [color, setColor] = useState("");
  const [todoListDb, setTodoListDb] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log(todo, color);
  const todoList = { todo, color };
  console.log(todoListDb);

  useEffect(() => {
    axios
      .get("http://localhost:5000/todos")
      .then((response) => {
        console.log(response);
        setTodoListDb(response.data);
      })
      .catch((err) => console.log(err));
  }, [loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("http://localhost:5000/todos", todoList)
      .then((response) => {
        console.log(response);
        form.reset();
      })
      .catch((err) => console.log(err));
  };

  const onDragEnd = (result) => {
    console.log(result);
    if (!result.destination) return;

    const reorderedTodos = Array.from(todoListDb);
    const [draggedItem] = reorderedTodos.splice(result.source.index, 1);
    reorderedTodos.splice(result.destination.index, 0, draggedItem);

    console.log("Reordered Todos:", reorderedTodos);

    axios
      .put("http://localhost:5000/todos/reorder", { todos: reorderedTodos })
      .then((response) => {
        console.log(response);
        // Update the local state with the reordered data
        setTodoListDb(reorderedTodos);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="w-full flex justify-center items-center p-8">
          <div>
            <div className="w-full bg-zinc-50 p-12">
              <h1 className="text-2xl text-center font-bold mb-10">
                Enter Your Todo List
              </h1>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col my-2">
                  <label>What do you want to do?</label>
                  <input
                    onChange={(e) => setTodo(e.target.value)}
                    type="text"
                    placeholder="What do you want to do?"
                    className="focus:outline-none border border-sky-500 px-4 py-1 rounded-md my-2"
                  />
                </div>
                <div className="my-4 flex gap-2 border border-sky-500 px-4 py-1 rounded-md">
                  <label>List Background Color:</label>
                  <input
                    onChange={(e) => setColor(e.target.value)}
                    type="color"
                  />
                </div>
                <div className="w-full flex justify-center">
                  <button
                    type="submit"
                    className="w-full text-lg bg-sky-500 px-4 py-1 rounded-md text-white"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>

            <div className="my-20 text-white">
              <h1>My Todo List</h1>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="box">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {todoListDb.map(({ _id, todo, color }, index) => (
                        <Draggable draggableId={_id} key={_id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <div
                                {...provided.dragHandleProps}
                                style={{
                                  width: "200px",
                                  height: "50px",
                                  backgroundColor: color,
                                }}
                                className="flex justify-center items-center"
                              >
                                {todo}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
