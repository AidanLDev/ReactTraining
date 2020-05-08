import React, { useReducer, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

// Using a reducer is clear because all the state logic is in one place
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

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { ...curHttpState, loading: true };
    case 'RESPONSE':
      return { ...curHttpState, loading: false };
    case 'ERROR':
      return { error: action.errorMessage, loading: false };
    case 'CLEAR':
      return { ...curHttpState, error: null };
    default:
      throw new Error('No http case');
  }
};

const Ingredients = () => {
  const [ingredients, dispatchIng] = useReducer(ingredientReducer, []); //  Initial value of ingredients is an empty array
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

  const handleAddIngredient = (ingredient) => {
    dispatchHttp({ type: 'SEND' });
    fetch('https://aidan-react-hooks.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async (response) => {
        dispatchHttp({ type: 'RESPONSE' });
        const responseData = await response.json();
        dispatchIng({
          type: 'ADD',
          ingredients: { id: responseData.name, ...ingredient },
        });
      })
      .catch((err) => {
        dispatchHttp({
          type: 'ERROR',
          errorMessage: `Ooops -  ${err.message}`,
        });
      });
  };

  const handleRemoveIngredient = (ingredientId) => {
    dispatchHttp({ type: 'SEND' });
    fetch(
      `https://aidan-react-hooks.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE',
      }
    )
      .then((res) => {
        dispatchHttp({ type: 'RESPONSE' });
        dispatchIng({ type: 'DELETE', id: ingredientId });
      })
      .catch((error) => {
        dispatchHttp({
          type: 'ERROR',
          errorMessage: `Ooops - ${error.message}`,
        });
      });
  };

  const handleFilterIngredients = useCallback((filteredIngredients) => {
    dispatchIng({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const clearError = () => {
    dispatchHttp({ type: 'CLEAR' });
  };

  return (
    <div className='App'>
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={handleAddIngredient}
        loading={httpState.loading}
      />

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
