import React from 'react';
import {mount, shallow} from 'enzyme';
import { ListUsers } from 'components/user/ListUsers';
import {EditProfileSettings} from "components/user/ListUsers";

describe('ListUsers is rendering', () => {
    let component;
    let data = {
        0: {
            Email: "yross@gucci.com",
            Firstname: "Yvan",
            Id: 1,
            Lastname: "Ross",
            Password: "12345",
            Role: 1
        }
    };
    let currentUser = data[0];
    let onSearch = jest.fn();

    beforeEach(() => {
        component = shallow(<ListUsers currentUser={currentUser} onSearch={onSearch} />);
    });
    //
    it('Is mounting', () => {
        component.setState(data);
        component.setProps({currentUser : currentUser});
        component.setState({'search': ''});
        expect(component.find('input').props().value).toEqual(component.props().search);
        expect(component.find('li').length).toEqual(1);
        expect(component.find('li').props().key).toEqual(currentUser.Email);
        expect(component.find('li').text()).toEqual(currentUser.Firstname+" "+currentUser.Lastname);
        let editProfil = component.find('EditProfileSettings').setProps({ isUser : false , userEmail : currentUser.Email} );
        expect(editProfil).toBe(null);
        editProfil = component.find('EditProfileSettings').setProps({ isUser : true , userEmail : currentUser.Email} );
        expect(editProfil).toMatchSnapshot();
        expect(component).toMatchSnapshot();
    });
});

describe('ListUsers behaves', () => {
    let component;
    let editProf;
    let data = {
        0: {
            Email: "yross@gucci.com",
            Firstname: "Yvan",
            Id: 1,
            Lastname: "Ross",
            Password: "12345",
            Role: 1
        }
    };
    let currentUser = data[0];
    let onSearch = jest.fn();

    beforeEach(() => {
        component = shallow(<ListUsers currentUser={currentUser} onSearch={onSearch} />);
        editProf = shallow(<EditProfileSettings isUser={true} userEmail={currentUser.Email}/>)
    });

    // On search
    it('OnSearch should be called properly', () => {
        const button = component.find('button').first();
        const searchInput = component.find('input').first();

        searchInput.simulate('change', {target: {value: 'Yro'}});
        button.simulate('click');
        expect(component.props().onSearch).toHaveBeenCalledTimes(1);
    });

    // On click on list item
    it('Click the list item links, should redirect rightfully', () => {
        component.setState(data);
        Object.values(data).map((d, i) => {
            let link = component.find('li').at(i).children().first();
            //Name link
            expect(link.props().to)
                .toEqual('/user/' + d.Email);
            //Edit button
            expect(editProf.props().to).toEqual('/user_edit/' + d.Email);
        });
    });
});