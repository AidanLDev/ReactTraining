import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const handleAddIngredient = (ingredient) => {
    setLoading(true);
    fetch('https://aidan-react-hooks.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' },
    }).then(async (response) => {
      setLoading(false);
      const responseData = await response.json();
      setIngredients((prevState) => [
        ...prevState,
        { id: responseData.name, ...ingredient },
      ]);
    });
  };

  const handleRemoveIngredient = (ingredientId) => {
    setLoading(true);
    fetch(
      `https://aidan-react-hooks.firebaseio.com/ingredients/${ingredientId}.jon`,
      {
        method: 'DELETE',
      }
    )
      .then((res) => {
        setLoading(false);
        setIngredients((prevState) =>
          prevState.filter((ing) => ing.id !== ingredientId)
        );
      })
      .catch((error) => {
        setLoading(false);
        setError(`Ooops - ${error.message}`);
      });
  };

  const handleFilterIngredients = useCallback((filteredIngredients) => {
    setIngredients(filteredIngredients);
  }, []);

  const clearError = () => {
    setError(null);
  };

  return (
    <div className='App'>
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={handleAddIngredient} loading={loading} />

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
