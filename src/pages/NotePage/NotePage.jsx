import { nhostClient } from "../../nhost/nhostClient";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import trash from "../../img/trash.svg";
import "./NotePage.css";

export const NotePage = () => {
  // Хуки
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [noteTasks, setNoteTasks] = useState([]);
  const [localNoteTasks, setLocalNoteTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAddingNoteMode, setIsAddingNoteMode] = useState(false);

  // Функции
  async function getNoteById(id) {
    const GET_NOTE_BY_ID = `
      query GetNoteById($id: uuid!) {
        notes_by_pk(id: $id) {
          id
          title
          task_ids
          created_at
          user_id
        }
      }
    `;

    const response = await nhostClient.graphql.request({
      query: GET_NOTE_BY_ID,
      variables: { id },
    });

    return response.body.data;
  };
  async function createTask(title = '', done = false, note_id) {
    const CREATE_TASK = `
      mutation CreateTask($title: String!, $done: Boolean!, $note_id: uuid!) {
        insert_tasks_one(object: {
          title: $title,
          done: $done,
          note_id: $note_id,
        }) {
          id
          title
          done
          note_id
          created_at
        }
      }
    `;

    await nhostClient.graphql.request({
      query: CREATE_TASK,
      variables: { title, done, note_id },
    }).then(data => {
      setLocalNoteTasks([...localNoteTasks, data.body.data.insert_tasks_one]);
    });
  };
  async function deleteTask(taskId) {
    setLocalNoteTasks(localNoteTasks.filter(task => task !== null && task.id !== taskId));

    const DELETE_TASK = `
      mutation DeleteTask($id: uuid!) {
        delete_tasks_by_pk(id: $id) {
          id,
          note_id
        }
      }
    `;

    const response = await nhostClient.graphql.request({
      query: DELETE_TASK,
      variables: { id: taskId },
    });
  };
  async function toggleTaskDone(taskId) {
    // 1. Получаем текущее значение done
    const GET_TASK = `
      query GetTask(\$id: uuid!) {
        tasks_by_pk(id: \$id) {
          id
          done
        }
      }
    `;

    const taskData = await nhostClient.graphql.request({
      query: GET_TASK,
      variables: { id: taskId },
    });

    if (!taskData.body.data.tasks_by_pk) throw new Error('Задача не найдена');

    const currentDone = taskData.body.data.tasks_by_pk.done;
    const newDone = !currentDone;

    // 2. Обновляем значение на противоположное
    const UPDATE_TASK = `
      mutation UpdateTaskDone($id: uuid!, $done: Boolean!) {
        update_tasks(
          where: { id: { _eq: \$id } }
          _set: { done: \$done }
        ) {
          affected_rows
          returning {
            id
            done
          }
        }
      }
    `;

    const data = await nhostClient.graphql.request({
      query: UPDATE_TASK,
      variables: { id: taskId, done: newDone },
    });
    
    return data.body.data.update_tasks.returning;
  };

  // useEffect
  useEffect(() => {
    getNoteById(id).then(data => setNote(data.notes_by_pk));
  }, []);
  useEffect(() => {
    nhostClient.auth.getUser().then(user => setCurrentUser(user.body));
  }, []);
  useEffect(() => {
    if(note === null) return;

    setTimeout(async() => {
      const taskIds = note.task_ids;

      let newNoteTasks = [];

      async function getTaskById(id) {
        const GET_TASK_BY_ID = `
          query GetTaskById($id: uuid!) {
            tasks_by_pk(id: $id) {
              id
              title
              done
              note_id
              created_at
              user_id
            }
          }
        `;
        
        const response = await nhostClient.graphql.request({
          query: GET_TASK_BY_ID,
          variables: { id },
        });

        return response.body.data.tasks_by_pk;
      };

      for(const taskId of taskIds) {
        await getTaskById(taskId).then(task => {
          newNoteTasks.push(task);
        });
      };

      setLocalNoteTasks(newNoteTasks);
      setNoteTasks(newNoteTasks);
    }, 1000);
  }, [note]);
  useEffect(() => console.log(localNoteTasks), [localNoteTasks]);

  return (
    <div className="note-page">
      <div className="container">
        {note !== null && currentUser !== null && (
          <div className="note-page__inner">
            <div className="note-page__top">
              <h1 className="note-page__title title">Заметка "{note.title}"</h1>
              <span className="note-page__created-at">{new Date(note.created_at).toLocaleDateString()}</span>
            </div>

            {localNoteTasks.filter(task => task !== null).length !== 0 || isAddingNoteMode ? (
              <ul className="note-page__tasks">
                {localNoteTasks.filter(task => task !== null).map(task => {
                  return (
                    <li className="note-page__task">
                      <div className="note-page__task-left">
                        <div className="note-page__task-checkbox" onClick={() => {
                          const localNoteTasksCopy = [...localNoteTasks];
                          const elInLocalNoteTasksCopy = localNoteTasksCopy.filter(taskEl => taskEl.id === task.id)[0];

                          elInLocalNoteTasksCopy.done = !elInLocalNoteTasksCopy.done;

                          setLocalNoteTasks([...localNoteTasks.filter(taskEl => taskEl.id !== task.id), elInLocalNoteTasksCopy]);
                          toggleTaskDone(task.id);
                        }}>
                          <div style={{ display: `${task.done ? "block" : "none"}` }}></div>
                        </div>
                        <span className="note-page__task-title">{task.title}</span>
                      </div>
                      <div className="note-page__task-right">
                        <button className="note-page__task-delete-btn" onClick={() => deleteTask(task.id)}>
                          <img src={trash} alt="Удалить" />
                        </button>
                      </div>
                    </li>
                  );
                })}
                {isAddingNoteMode && (
                  <li className="note-page__task">
                    <div className="note-page__task-left">
                      <input className="input" type="text" placeholder="Введите название" onBlur={(e) => {
                        const clearValue = e.currentTarget.value.trim();

                        if(clearValue.length === 0) {
                          setIsAddingNoteMode(false);
                          return;
                        };

                        createTask(clearValue, false, note.id);
                        setIsAddingNoteMode(false);
                      }} autoFocus={true} />
                    </div>
                    <div className="note-page__task-right">
                      <button className="note-page__task-delete-btn" onClick={() => deleteTask(task.id)}>
                        <img src={trash} alt="Удалить" />
                      </button>
                    </div>
                  </li>
                )}
              </ul>
            ) : (
              <span className="note-page__empty-title">В этой заметке нет задач...</span>
            )}

            <button className="note-page__add-btn btn" onClick={() => setIsAddingNoteMode(true)}>Добавить задачу</button>
          </div>
        )}
      </div>
    </div>
  );
};