import { Todo } from '../types/Todo';
import { client } from './fetchClient';

export enum Status {
  all = 'All',
  active = 'active',
  completed = 'completed',
}

export const filter = (todos: Todo[], selectedFilter: Status): Todo[] => {
  switch (selectedFilter) {
    case Status.all:
      return todos;

    case Status.active:
      return todos.filter(todo => !todo.completed);

    case Status.completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};

export const deleteTodo = (todoId: number): Promise<void> =>
  client.delete(`/todos/${todoId}`).then(() => {});

export const addTodo = (todo: Omit<Todo, 'id'>): Promise<Todo> =>
  client.post<Todo>('/todos', todo);

export const updateTodoCompleted = (
  todoId: number,
  completed: boolean,
): Promise<Todo> => client.patch<Todo>(`/todos/${todoId}`, { completed });
