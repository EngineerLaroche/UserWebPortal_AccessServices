import React from 'react';
import {mount, shallow} from 'enzyme';
import {RegisterReferent} from 'components/referent/RegisterReferent';
import agent from 'agent';
import { MemoryRouter } from 'react-router-dom';

describe('RegisterReferent is rendering', () => {
    let component;
    let onChangeFirstname = jest.fn();
    let onChangeLastname = jest.fn();
    let onChangeTitle = jest.fn();
    let onChangeWorkPhone = jest.fn();
    let onChangeCellPhone = jest.fn();
    let onChangeFax = jest.fn();
    let onChangeEmail = jest.fn();
    let onSubmit = jest.fn();
    let onAssociate = jest.fn();
    let onPreference = jest.fn();

    beforeEach(() => {
        component = mount(<MemoryRouter path="/referent/register">
                            <RegisterReferent
                                              onChangeFirstName={onChangeFirstname}
                                              onChangeLastname={onChangeLastname}
                                              onChangeTitle={onChangeTitle}
                                              onChangeWorkPhone={onChangeWorkPhone}
                                              onChangeCellPhone={onChangeCellPhone}
                                              onChangeFax={onChangeFax}
                                              onChangeEmail={onChangeEmail}
                                              onSubmit={onSubmit}
                                              onAssociate={onAssociate}
                                              onPreference={onPreference}

                            /></MemoryRouter>);
    });

    afterAll(() => {
        agent.Auth.logout();
    });

    it('Props are well defined', () => {
        const registerRef = component.children();
        expect(registerRef.props().onChangeFirstname).toBeDefined();
        expect(registerRef.props().onChangeLastname).toBeDefined();
        expect(registerRef.props().onChangeTitle).toBeDefined();
        expect(registerRef.props().onChangeWorkPhone).toBeDefined();
        expect(registerRef.props().onChangeCellPhone).toBeDefined();
        expect(registerRef.props().onChangeFax).toBeDefined();
        expect(registerRef.props().onChangeEmail).toBeDefined();
        expect(registerRef.props().onSubmit).toBeDefined();
        expect(registerRef.props().onAssociate).toBeDefined();
        expect(registerRef.props().onPreference).toBeDefined();
    });
});
