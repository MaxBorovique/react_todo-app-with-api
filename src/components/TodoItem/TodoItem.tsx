/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useEffect, useState } from 'react';
import { deleteTodo, updateTodoCompleted } from '../../utils/helpers';
import { errorMessages } from '../../utils/const';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<
    React.SetStateAction<{ hasError: boolean; message: string }>
  >;
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  setError,
  isLoading,
  inputRef,
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTodo(todo.id);
      setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
      inputRef.current?.focus();
    } catch (error) {
      setError({ hasError: true, message: errorMessages.deleteError });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      const updatedTodo = await updateTodoCompleted(todo.id, !todo.completed);

      setTodos(currentTodos =>
        currentTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
      );
    } catch (error) {
      setError({ hasError: true, message: errorMessages.updateError });
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={handleStatusChange}
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
