import React, { useReducer, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

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

const Ingredients = () => {
  const [ingredients, dispatchIng] = useReducer(ingredientReducer, []); //  Initial value of ingredients is an empty array
  const { loading, error, data, sendReq } = useHttp();

  const handleAddIngredient = useCallback((ingredient) => {
    // dispatchHttp({ type: 'SEND' });
    // fetch('https://aidan-react-hooks.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: { 'Content-Type': 'application/json' },
    // })
    //   .then(async (response) => {
    //     dispatchHttp({ type: 'RESPONSE' });
    //     const responseData = await response.json();
    //     dispatchIng({
    //       type: 'ADD',
    //       ingredients: { id: responseData.name, ...ingredient },
    //     });
    //   })
    //   .catch((err) => {
    //     dispatchHttp({
    //       type: 'ERROR',
    //       errorMessage: `Ooops -  ${err.message}`,
    //     });
    //   });
  }, []);

  const handleRemoveIngredient = useCallback(
    (ingredientId) => {
      // dispatchHttp({ type: 'SEND' });
      // `https://aidan-react-hooks.firebaseio.com/ingredients/${ingredientId}.json`,
      sendReq(
        `https://aidan-react-hooks.firebaseio.com/ingredients/${ingredientId}.json`,
        'DELETE'
      );
    },
    [sendReq]
  );

  const handleFilterIngredients = useCallback((filteredIngredients) => {
    dispatchIng({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const clearError = useCallback(() => {
    // dispatchHttp({ type: 'CLEAR' });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={handleRemoveIngredient}
      />
    );
  }, [ingredients, handleRemoveIngredient]);

  return (
    <div className='App'>
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={handleAddIngredient} loading={loading} />
      {ingredientList}
      <section>
        <Search handleFilterIngredients={handleFilterIngredients} />
      </section>
    </div>
  );
};

export default Ingredients;
