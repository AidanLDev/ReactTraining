import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  const handleAddIngredient = (ingredient) => {
    fetch('https://aidan-react-hooks.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' },
    }).then(async (response) => {
      const responseData = await response.json();
      setIngredients((prevState) => [
        ...prevState,
        { id: responseData.name, ...ingredient },
      ]);
    });
  };

  const handleRemoveIngredient = (ingredientId) => {
    fetch(
      `https://aidan-react-hooks.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE',
      }
    ).then((res) => {
      setIngredients((prevState) =>
        prevState.filter((ing) => ing.id !== ingredientId)
      );
    });
  };

  const handleFilterIngredients = useCallback((filteredIngredients) => {
    setIngredients(filteredIngredients);
  }, []);

  return (
    <div className='App'>
      <IngredientForm onAddIngredient={handleAddIngredient} />

      <section>
        <Search handleFilterIngredients={handleFilterIngredients} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={handleRemoveIngredient}
        />
      </section>
    </div>
  );
};

export default Ingredients;
