import React from 'react';
import {mount, shallow} from 'enzyme';
import { DetailsDemandeService } from 'components/demandeService/DetailsDemandeService';
import agent from 'agent';

describe('DetailsDemandeService is rendering', () => {
    let component;

    beforeAll(() => {
        agent.Auth.login('yross@gucci.com','12345');
        agent.Auth.current();
        component = mount(<DetailsDemandeService />)
    });

    beforeEach(() => {

    });

    afterEach(() => {

    });

    afterAll(() => {
        agent.Auth.logout();
    });

    it(' renders components', () => {
        expect(true).toEqual(true);
        expect(component.find('.row').length).toEqual(1);
    });
});
