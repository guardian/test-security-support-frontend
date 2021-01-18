/* eslint-disable react/no-unescaped-entities */
// @flow
// $FlowIgnore
import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import List from 'components/list/list';
import Tabs from 'components/tabs/tabs';

const stories = storiesOf('Content elements', module);

stories.add('List', () => (
  <List items={[
    { explainer: 'This is a list' },
    { explainer: 'You can put items in it, even if they\'re long sentences that will definitely overflow and wrap on mobile' },
    { explainer: 'It\'s very nice' },
  ]}
  />
));

stories.add('Tabs', () => {
  function TabsContainer() {
    const [tabs, setTabs] = useState([
      {
        id: 'cat',
        text: 'Cats',
        selected: true,
        content: (
          <p>
            Cat ipsum dolor sit amet, side-eyes your "jerk" other hand while being petted. Eat a rug and furry furry
            hairs everywhere oh no human coming lie on counter don't get off counter. Meow in empty rooms i vomit
            in the bed in the middle of the night cereal boxes make for five star accommodation but sit on human they
            not getting up ever and i'm bored inside, let me out i'm lonely outside, let me in i can't make up my mind
            whether to go in or out, guess i'll just stand partway in and partway out, contemplating the universe for
            half an hour how dare you nudge me with your foot?!?!
          </p>
        ),
      },
      {
        id: 'dog',
        text: 'Dogs',
        selected: false,
        content: (
          <p>
            Doggo ipsum bork borkdrive very taste wow wow very biscit vvv, heckin angery woofer heck much ruin diet
            thicc, pupperino yapper shooberino. Sub woofer he made many woofs boof puggo porgo boof sub woofer, shoob
            borking doggo doge such treat. You are doin me a concern what a nice floof shoob very taste wow, borking
            doggo heckin good boys and girls. Big ol porgo what a nice floof h*ck I am bekom fat very good spot,
            maximum borkdrive pupper blep. Heckin I am bekom fat thicc wow very biscit most angery pupper I have ever
            seen, heckin good boys lotsa pats snoot. Maximum borkdrive very jealous pupper he made many woofs porgo
            pats, lotsa pats dat tungg tho.
          </p>
        ),
      },
    ]);
    function onTabChange(tabId: string) {
      setTabs(tabs.map((tab) => {
        if (tab.id === tabId) {
          return { ...tab, selected: true };
        }
        return { ...tab, selected: false };
      }));
    }

    return (
      <div style={{ padding: '48px' }}>
        <Tabs
          tabsLabel="Pets"
          tabElement="button"
          tabs={tabs}
          onTabChange={onTabChange}
        />
      </div>
    );
  }
  return <TabsContainer />;
});
