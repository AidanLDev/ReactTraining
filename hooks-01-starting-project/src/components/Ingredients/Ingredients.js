import React, { useReducer, useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredients];
    case 'DELETE':
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error('No Ingredients action');
  }
};

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []); //  Initial value of ingredients is an empty array
  // const [ingredients, setIngredients] = useState([]);
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
      // setIngredients((prevState) => [
      //   ...prevState,
      //   { id: responseData.name, ...ingredient },
      // ]);
      dispatch({
        type: 'ADD',
        ingredients: { id: responseData.name, ...ingredient },
      });
    });
  };

  const handleRemoveIngredient = (ingredientId) => {
    setLoading(true);
    fetch(
      `https://aidan-react-hooks.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE',
      }
    )
      .then((res) => {
        setLoading(false);
        // setIngredients((prevState) =>
        //   prevState.filter((ing) => ing.id !== ingredientId)
        // );
        dispatch({ type: 'DELETE', id: ingredientId });
      })
      .catch((error) => {
        setLoading(false);
        setError(`Ooops - ${error.message}`);
      });
  };

  const handleFilterIngredients = useCallback((filteredIngredients) => {
    // setIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients });
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
