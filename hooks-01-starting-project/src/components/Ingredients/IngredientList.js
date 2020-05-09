import React, { memo } from 'react';

import './IngredientList.css';

const IngredientList = memo((props) => {
  console.log('List re-render');
  return (
    <section className='ingredient-list'>
      <h2>Loaded Ingredients</h2>
      <ul>
        {props.ingredients.map((ig) => (
          <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
});

export default IngredientList;
