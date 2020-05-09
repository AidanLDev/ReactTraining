import React, { useEffect, useState, useRef } from 'react';

import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';
import Card from '../UI/Card';
import './Search.css';

const Search = React.memo((props) => {
  const [filter, setFilter] = useState('');
  const { handleFilterIngredients } = props;
  const inputRef = useRef();
  const { loading, data, error, sendReq, clear } = useHttp();

  useEffect(() => {
    if ((!loading && !error, data)) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          amount: data[key].amount,
          title: data[key].title,
        });
      }
      handleFilterIngredients(loadedIngredients);
    }
  }, [data, loading, error, handleFilterIngredients]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filter === inputRef.current.value) {
        const query =
          filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`;
        sendReq(
          'https://aidan-react-hooks.firebaseio.com/ingredients.json' + query,
          'GET'
        );
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [filter, inputRef, sendReq]);

  return (
    <section className='search'>
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
          {loading && <span>Loading...</span>}
          <input
            ref={inputRef}
            type='text'
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
