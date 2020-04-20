import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  const handleAddIngredient = (ingredient) => {
    setIngredients((prevState) => [
      ...prevState,
      { id: Math.random().toString(), ...ingredient },
    ]);
  };

  const handleRemoveIngredient = (ingredientId) => {
    setIngredients((prevState) =>
      prevState.filter((ing) => ing.id !== ingredientId)
    );
  };

  return (
    <div className='App'>
      <IngredientForm onAddIngredient={handleAddIngredient} />

      <section>
        <Search />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={handleRemoveIngredient}
        />
      </section>
    </div>
  );
};

export default Ingredients;
