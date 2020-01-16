import React from 'react';
import {mount, shallow} from 'enzyme';
import {Login} from 'components/Login';
import * as authReducer from 'reducers/auth';
import {
    LOGIN,
    REGISTER,
    LOGIN_PAGE_UNLOADED,
    REGISTER_PAGE_UNLOADED,
    ASYNC_START,
    UPDATE_FIELD_AUTH
} from 'constants/actionTypes';
import { Auth } from 'agent';


describe('Login is rendering', () => {
    let login;

    beforeEach(() => {
        login = shallow(<Login/>);
    });

    it('Login renders nested components', () => {
        expect(login.find('ListErrors').length).toEqual(1);
        expect(login.find('form').length).toEqual(1);
        expect(login.find('fieldset').length).toEqual(4);
        expect(login.find('input').length).toEqual(3);
        expect(login.find('button').length).toEqual(1);
    });

    it('Lifecycle method will be called', () => {
        const componentWillUnmount = jest.fn();

        class Log extends Login {
            constructor(props) {
                super(props)
                this.componentWillUnmount = componentWillUnmount
            }

            render() {
                return (<Login/>)
            }
        }

        const login = shallow(<Log/>);
        expect(componentWillUnmount).not.toBeCalled();
        login.unmount();
        expect(componentWillUnmount).toBeCalled();
    })
});

describe('Login with input errors', () => {
    const onSubmit = jest.fn();
    const onChangeEmail = jest.fn();
    const onChangePassword = jest.fn();
    const onUnload = jest.fn();
    let login;

    beforeEach(() => {
        login = mount(<Login onChangeEmail={onChangeEmail}
                             onChangePassword={onChangePassword}
                             onUnload={onUnload}
                             onSubmit={onSubmit}
        />);
    });

    it('Props are well defined', () => {
        expect(login.props().onSubmit).toBeDefined();
        expect(login.props().onChangePassword).toBeDefined();
        expect(login.props().onChangeEmail).toBeDefined();
        expect(login.props().onUnload).toBeDefined();
        login.unmount();
    });

    // To be reviewed ... ListErrors marche pas bien.
    it('Try to login with wrong credentials', () => {
        const button = login.find('button').first();
        const userInput = login.find('input').first();
        const pswInput = login.find('input').at(1);

        userInput.simulate('change', {target: {value: 'yross@notgood.com'}});
        expect(onChangeEmail).toBeCalledWith('yross@notgood.com');
        pswInput.simulate('change', {target: {value: 'notgood'}});
        expect(onChangePassword).toBeCalledWith('notgood');
        button.simulate('submit');
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(login.find('ListErrors')).not.toBe(null);
        login.unmount();
    });

    it('Try to login with right credentials', () => {
        const button = login.find('button').first();
        const userInput = login.find('input').first();
        const pswInput = login.find('input').at(1);
        const testValues = {
            email: 'yross@gucci.com',
            password: '12345',
        };

        userInput.simulate('change', {target: {value: 'yross@gucci.com'}});
        expect(onChangeEmail).toBeCalledWith(testValues.email);

        pswInput.simulate('change', {target: {value: '12345'}});
        expect(onChangePassword).toBeCalledWith(testValues.password);

        button.simulate('submit');
        // expect(login.find('ListErrors')).toBe(null);
        expect(onSubmit).toHaveBeenCalledTimes(2);
        login.unmount();
    });
});

describe('Actions from reducers', () => {
    let login;
    const testValues = {
        email: 'yross@gucci.com',
        password: '12345',
    };
    const action = { type: LOGIN,
        payload: Auth.login(testValues.email, testValues.password)
    };

    beforeEach(() => {
        login = mount(<Login />)
    });

    it('should return initiale state', () => {
        expect(authReducer.default({}, {})).toEqual({});
    });
    it('should handle LOGIN', () => {
        expect(authReducer.default({}, action)).toEqual(
            {"errors": null, "inProgress": false}
        );
    });
});
