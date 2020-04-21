import React, { useEffect, useState, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo((props) => {
  const [filter, setFilter] = useState('');
  const { handleFilterIngredients } = props;
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filter === inputRef.current.value) {
        const query =
          filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`;
        fetch(
          'https://aidan-react-hooks.firebaseio.com/ingredients.json' + query
        )
          .then((res) => res.json())
          .then((resData) => {
            const loadedIngredients = [];
            for (const key in resData) {
              loadedIngredients.push({
                id: key,
                amount: resData[key].amount,
                title: resData[key].title,
              });
            }
            handleFilterIngredients(loadedIngredients);
          });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [filter, handleFilterIngredients, inputRef]);

  return (
    <section className='search'>
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
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
