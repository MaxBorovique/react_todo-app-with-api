/* eslint-disable @typescript-eslint/indent */
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { errorMessages, TEMP_TODO } from '../../utils/const';
import classNames from 'classnames';
import { addTodo } from '../../utils/helpers';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<
    React.SetStateAction<{ hasError: boolean; message: string }>
  >;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
};
export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setError,
  setTempTodo,
  setIsLoading,
  inputRef,
  isLoading,
}) => {
  const [title, setTitle] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title.trim()) {
      setTempTodo({ ...TEMP_TODO, title });
      setIsLoading(true);
      addTodo({ title: title.trim(), userId: 1318, completed: false })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
          setTitle('');
        })
        .catch(() =>
          setError({ hasError: true, message: errorMessages.addingError }),
        )
        .finally(() => {
          setIsLoading(false);
          setTempTodo(null);
        });
    } else {
      setError({ hasError: true, message: errorMessages.emptyError });
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          disabled={isLoading}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
