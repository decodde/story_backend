const Constants = {
    USERNAME_EXISTS: "Username exists",
    USERNAME_NOT_EXISTS: "Username does not exist",
    STORY_ID_EXISTS: "Story with this id exists",
    STORY_ID_NOT_EXISTS: "Story with this id does not exist",
    STORY_INACCESSIBLE : "Story is inaccessible",
    STORY_AUTH_FAILED : "Authorization to view story failed",
    SALT: "storystory",
    USERNAME_RETRIEVAL_SUCCESS: "Data retrieved successfully",
    STORY_RETRIEVAL_SUCCESS : "Data retrieved successfully",
    DB_ERROR: "Error encountered with database",
    STORY_DELETE_SUCCESS : "Story deleted successfully",
    STORY_DELETE_FAILED : "Story could not be deleted",
    AUTH_FAILED : "Apikey is invalid",
    LOGIN_SUCCESS: "Login successful",
    LOGIN_FAILED: "Login failed",
    SIGNUP_FAILED : "Signup failed",
    SIGNUP_SUCCESS : "Signup successful",
    REQUIRED_FIELDS_MISSING : "Required fields are missing",
    EMPTY_STORY : "No story yet, if you are the creator please do update" ,
    STORY_CREATION_FAILED : "Failed to create story",
    STORY_CREATION_SUCCESS : "Story created successfully",
    NO_TITLE : "No title here",
    OFFICIAL_EMAIL : "notifications@story.com",
    APP_NAME : "story",
    EMAIL : {
        NEW_STORY : async (title,id) => {
            return {
                subject : "NEW STORY CREATED",
                body : `Awesome you just created a new story; ${title}. `
            }
        },
        SIGNUP : async (username)  => {
            return {
                subject : `Welcome ${username}`,
                body : `Welcome to ${Constants.APP_NAME}. Join us in adding value as acreative with your imaginations, experiences and beliefs`,
            }
        }
    },
    EMAIL_SENT_SUCCESS : "Email sent successfully",
    EMAIL_SENT_FAIL : "Error sending email",
    EMAIL_INVALID : "Email could not be sent, Email invalid?"
}

exports.Constants = Constants;