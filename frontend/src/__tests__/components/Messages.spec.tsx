import * as React from 'react';
import { shallow } from 'enzyme';
import { Messages } from '../../components/Messages/Messages';

describe('Messages comonent', () => {
  const messages = ['message1', <p>message2</p>];
  const errorMessages = ['errorMessage1', <p>errorMessage2</p>];
  it('render', () => {
    const el = shallow(<Messages messages={messages} />);
    expect(el.find('ul.messages')).toHaveLength(1);
  });
  it('"messages" prop should be passed into each <li> element', () => {
    const el = shallow(<Messages messages={messages} />);
    el.find('li').forEach((item, i) => {
      expect(item.containsMatchingElement(messages[i] as any)).toBe(true);
    });
  });
  it('"errorMessages" prop should be passed into each <li> element', () => {
    const el = shallow(<Messages errorMessages={errorMessages} />);
    el.find('li').forEach((item, i) => {
      expect(item.containsMatchingElement(errorMessages[i] as any)).toBe(true);
    });
  });
  it('"errorMessages" should be rendered after "messages"', () => {
    const el = shallow(<Messages messages={messages} errorMessages={errorMessages} />);
    el.find('li').forEach((item, i) => {
      if (i < messages.length) {
        expect(item.containsMatchingElement(messages[i] as any)).toBe(true);
      } else {
        const msg = errorMessages[i - messages.length] as any;
        expect(item.containsMatchingElement(msg)).toBe(true);
      }
    });
  });
});
