const validationChecker = (function() {

  //TODO remove all console.log string from the file


  const defaultMessages = {
    required: 'The filed is mandatory.',
    isEmail: 'Please enter a valid email address.',
    isNumber: 'Please enter a valid number',
    isRadioBtn: 'The filed is mandatory!',
    duplicate: 'The passwords must be the equal.',
    minLength: 'The field length must not be less than {1}.',
    maxLength: 'The field length must not be higher than {1}.'
  };

  const defaultRules = {
    required: /\S+/,
    isEmail: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/,
    isNumber: /^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/,
  };


  let errors = [];


  return {


    validateForm: function(currentState, validationRules){
      this._resetError();
      console.log('ERRORS: ', errors);

      const formData = this._prepareFormDataObj(currentState, validationRules);


      for (let field in validationRules) {
        const rulesOfFieldObj = validationRules[field];
        this._checkRulesFunc(field, rulesOfFieldObj, formData);
      }

      return this.isFormValid();

    },

    _prepareFormDataObj: function(currentState, validationRules){
      // This function compare the validationRules with this.state
      // and returns the formData obj which contains fields from this.state according to validationRules obj.
      let formData = {};

      console.log('currentState', currentState);

      for (let prop in currentState) {

        if (validationRules.hasOwnProperty(prop)){
          formData[prop] = currentState[prop];
        }
      }
      return formData;
    },

    _checkRulesFunc: function(nameField, rulesObj, formData){

      for (let rule in rulesObj){

        // Validation for not required field [required: false].
        // If the form field is empty the validation will not use.
        // If the form field contains data the validation will be used


        if (!rulesObj.required && rule !== 'required'){
         if(defaultRules.required.test(formData[nameField])){
           switch (rule) {
             case 'isEmail':
               if(rulesObj[rule]) {
                 if (!defaultRules[rule].test(formData[nameField])){
                   this._addError(nameField, rule, rulesObj[rule]);
                 }
               }
               break;

             case 'isNumber':
               if (rulesObj[rule]) {
                 if (!defaultRules[rule].test(formData[nameField])) {
                   this._addError(nameField, rule, rulesObj[rule])
                 }
               }

             default:
               break;


           }
         }
        }

        // Validation for the required field [required: true]

        if (rulesObj.required) {
          switch (rule) {
            case 'required':
              if (rulesObj[rule]) {
                if (!defaultRules[rule].test(formData[nameField])) {
                  this._addError(nameField, rule, rulesObj[rule])
                }
              }
              break;
            case 'isEmail':
              if(rulesObj[rule]) {
                if (!defaultRules[rule].test(formData[nameField])){
                  this._addError(nameField, rule, rulesObj[rule]);
                }
              } else {
                throw `ERROR: It looks like you miss rule for ${nameField}, check out your Rules settings`;
              }
              break;

            case 'isNumber':
              if (rulesObj[rule]) {
                if (!defaultRules[rule].test(formData[nameField])) {
                  this._addError(nameField, rule, rulesObj[rule])
                }
              }
              break;

            case 'isRadioBtn':
              if (!rulesObj[rule]) {
                if (formData[nameField]){
                  this._addError(nameField, rule, rulesObj[rule]);
                }
              }
              break;

            case 'duplicate':
              const currentFieldVal = formData[nameField];
              const compareWithFieldVal = formData[rulesObj[rule]];

              if (currentFieldVal !== compareWithFieldVal){
                this._addError(nameField, rule, rulesObj[rule]);
              }
              break;

            case 'minLength':
              if (formData[nameField].length < rulesObj[rule]) {
                this._addError(nameField, rule, rulesObj[rule])
              }
              break;

            case 'maxLength':
              if (formData[nameField].length > rulesObj[rule]) {
                this._addError(nameField, rule, rulesObj[rule])
              }
              break;

            default:
              break;

          }
        }

      }
      console.log(errors);
    },

    _addError: function(nameField, rule, value) {


      if (!defaultMessages[rule]){
        throw `ERROR: It looks like you miss error message for ${rule} rule, check out your Messages settings`;
      }

      const errorMsg = defaultMessages[rule].replace('{0}', nameField).replace('{1}', value);

      let [error] = errors.filter((error) => error.nameField === nameField);

      if (error) {
        const index = errors.indexOf(error);
        error.failedRules.push(rule);
        error.messages.push(errorMsg);
        errors[index] = error;

      } else {
        errors.push({
          nameField: nameField,
          failedRules: [rule],
          messages: [errorMsg]
        })
      }
    },

    _resetError: function () {
       errors = [];
    },

    destroy: function() {
      this._resetError();
    },

    isFormValid: function () {
      return errors.length === 0;
    },

    // Method to return errors on a specific field
    getErrorsInField: function(nameField) {
      const foundError = errors.find(error => {

        return error.nameField === nameField
      });


      if (!foundError) {
        return []
      }

      return foundError.messages
    },

    getErrorsObj: function(){
      return errors
    }

  }


})();


export default validationChecker;
