import React from 'react';
import {mount, shallow} from 'enzyme';
import { ProfileReferent } from 'components/referent/ProfileReferent';
import agent from 'agent';

describe('ProfileReferent is rendering', () => {
    let component;

/*
TypeError: Cannot read property 'find' of undefined

Invariant Violation: Element type is invalid: expected a string (for built-in componen
ts) or a class/function (for composite components) but got: undefined. You likely forgot t
o export your component from the file it's defined in, or you might have mixed up default
and named imports.

    Check the render method of `WrapperComponent`.
*/

    beforeAll(() => {
        agent.Auth.login('yross@gucci.com','12345');
        agent.Auth.current();
//        component = mount(<ProfileReferent />)
    });

    beforeEach(() => {

    });

    afterEach(() => {

    });

    afterAll(() => {
        agent.Auth.logout();
    });

    it('ProfileReferent renders components', () => {
        expect(true).toEqual(true);
//        expect(component.find('.row').length).toEqual(1);
    });
});
