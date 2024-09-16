import { adminBarPublishInit, adminBarPublishHandleResponse } from '../src/main';

const nullCall = () => {};
const missingButton =  () => null;
const adminBarButton = {
    tagName: 'A',
    firstChild: 'Publish',
};


describe( 'Initialization', () => {
    beforeEach(() => {
        global.sfnAdminBarPublish = undefined;  // Define it globally for the tests
    });
    
    test( 'if sfnAdminBarPublish is undefined, checks if the Admin Bar button is there and removes it', () => {
        const mockRemoveChild = jest.fn();
        const mockQuerySelector = jest.spyOn(document, 'querySelector').mockImplementation( () => Object.assign( {}, adminBarButton, {
            parentNode: { removeChild: mockRemoveChild }
        } ) );
        adminBarPublishInit();
        expect( mockQuerySelector ).toHaveBeenCalled();
        expect( mockRemoveChild ).toHaveBeenCalled();
    });
    
    test( 'if the post status is other than draft or publish, checks if the Admin Bar button is there and removes it', () => {
        sfnAdminBarPublish = {
            postStatus: 'private',
        };
        const mockRemoveChild = jest.fn();
        const mockQuerySelector = jest.spyOn(document, 'querySelector').mockImplementation( () => Object.assign( {}, adminBarButton, {
            parentNode: { removeChild: mockRemoveChild }
        } ) );
        adminBarPublishInit();
        expect( mockQuerySelector ).toHaveBeenCalled();
        expect( mockRemoveChild ).toHaveBeenCalled();
    });
    
    test( 'ends if button in admin bar is not found', () => {
        sfnAdminBarPublish = {
            postStatus: 'draft',
        };
    
        const mockQuerySelector = jest.spyOn(document, 'querySelector').mockImplementation( missingButton );
        expect( mockQuerySelector ).toHaveBeenCalled();
    });
    
    test( 'works if all is good', () => {
        sfnAdminBarPublish = {
            postStatus: 'draft',
        };
        
        const mockAddEventListener = jest.spyOn(document, 'addEventListener').mockImplementation( nullCall );
        const mockQuerySelector = jest.spyOn(document, 'querySelector').mockImplementation( () => Object.assign( {}, adminBarButton, {
            addEventListener: mockAddEventListener
        } ) );
    
        expect( adminBarPublishInit() ).toBe( true );
        expect( mockQuerySelector ).toHaveBeenCalled();
        expect( mockAddEventListener ).toHaveBeenCalled();
    });
} );

describe( 'Response handling', () => {
    const res = {
        'postStatus': 'publish',
        'permalink' : 'https://example.org/example-post',
        'message'   : 'Post successfully published!',
    };

    const mockAlert = jest.spyOn( window, 'alert' ).mockImplementation( () => {
        return res.message;
    } );
    const mockHistory = jest.spyOn( history, 'replaceState' ).mockImplementation( nullCall );
    const mockClassListAdd = jest.fn();
    const mockClassListRemove = jest.fn();
    const mockRemoveChild = jest.fn();
    const adminBarButtonToUpdate = Object.assign( {}, adminBarButton, {
        parentNode: {
            removeChild: mockRemoveChild,
            classList: { add: mockClassListAdd, remove: mockClassListRemove }
        },
    } );

    beforeEach(() => {
        global.sfnAdminBarPublish = {
            postStatus: 'draft',
            publish: 'Draft',
            draft: 'Publish',
        };
        adminBarPublishHandleResponse( res, adminBarButtonToUpdate );
    });

    test( 'shows message', () => {
        expect( mockAlert ).toHaveBeenCalled();
        expect( mockClassListAdd ).toHaveBeenCalled();
        expect( mockClassListRemove ).toHaveBeenCalled();
        expect( mockHistory ).toHaveBeenCalled();
    } );
    
    test( 'updates the button in Admin Bar', () => {
        expect( mockClassListAdd ).toHaveBeenCalled();
        expect( mockClassListRemove ).toHaveBeenCalled();
    } );
    
    test( 'if post was published it now says Draft', () => {
        expect( adminBarButtonToUpdate.textContent ).toBe( 'Draft' );
    } );
    
    test( 'updates post status', () => {
        expect( sfnAdminBarPublish.postStatus ).toBe( 'publish' );
    } );
    
    test( 'rewrites the URL in the browser', () => {
        expect( mockHistory ).toHaveBeenCalled();
    } );
} );