///src/utils/deck.js

import { generateCardsForScenario } from "../game/engine.js";

export function buildDeckFromScenarios(scenarios)
{
  const deck = [];

  scenarios.forEach(function (scenario)
  {
    const cardsForScenario = generateCardsForScenario(scenario);

    cardsForScenario.forEach(function (cardEntry)
    {
      deck.push(
        {
          scenarioId: scenario.id,
          scenarioDescription: scenario.description,
          slotId: cardEntry.slotId,
          category: cardEntry.category,
          cardId: cardEntry.cardId,
          isCorrect: cardEntry.isCorrect
        }
      );
    });
  });

  return deck;
}
