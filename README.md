# ts.validator.fluent

## TypeScript based generic validation framework library

[**NPM package**](https://www.npmjs.com/package/ts.validator.fluent)

[**Demo Angular 6 CLI app using the framework library**](https://github.com/VeritasSoftware/ts-validator-app-angular6)

| Rules        | Description                                                                    |
| ------------ | ------------------------------------------------------------------------------ |
| If           | Used for program flow. The then part is only evaluated if the if part is true. |
| ForEach      | Used to iterate and apply validations to an array.                             |
| ForStringProperty | Used to stack multiple validations against a single string property.      |
| ForDateProperty   | Used to stack multiple validations against a single Date property.        |
| For (deprecated)  | Used to stack multiple validations against a single property.             |
| ForType      | Used to chain validation rules for a type against a single property.           |
| Required     | Used to test if a property is true to a conditon.                              |
| NotNull      | Used to test if a property is not null.                                        |
| IsNull       | Used to test if a property is null.                                            |
| CreditCard   | Used to test if a number property is a valid credit card number.               |
| ToResult     | Returns the validation result.                                                 |

| String Rules   | Description                                                           |
| ------------   | --------------------------------------------------------------------- |
| NotEmpty       | Used to test if a string is not empty.                                |
| IsEmpty        | Used to test if a string is empty.                                    |
| Length         | Used to test if a string length is between specified lengths.         |
| Matches        | Used to test if a string matches a regular expression.                |
| NotMatches     | Used to test if a string does not match a regular expression.         |
| Email          | Used to test if a string is a valid email address.                    |
| IsLowercase    | Used to test if a string is lower case.                               |
| IsUppercase    | Used to test if a string is upper case.                               |
| IsMixedcase    | Used to test if a string is mixed case.                               |
| IsNumeric      | Used to test if a string is numeric.                                  |
| IsAlpha        | Used to test if a string is alpha.                                    |
| IsAlphaNumeric | Used to test if a string is alpha numeric.                            |
| IsGuid         | Used to test if a string is guid/uuid.                                |
| IsBase64       | Used to test if a string is base64.                                   |
| IsUrl          | Used to test if a string is an url.                                   |
| IsCountryCode  | Used to test if a string is a 2 letter country code.                  |
| Contains       | Used to test if a sub string is contained in the string.              |

| Date Rules        | Description                                                        |
| ------------      | ------------------------------------------------------------------ |
| IsDateOn          | Used to test if a date is on the specified date.                   |
| IsDateAfter       | Used to test if a date is after the specified date.                |
| IsDateOnOrAfter   | Used to test if a date is on or after the specified date.          |
| IsDateBefore      | Used to test if a date is before the specified date.               |
| IsDateOnOrBefore  | Used to test if a date is on or before the specified date.         |
| IsDateBetween     | Used to test if a date is between two specified dates.             |
| IsDateLeapYear    | Used to test if a date is in a leap year.                          |

| Number Rules                 | Description                                                                |
| ------------                 | ------------------------------------------------------------------         |
| IsNumberEqual                | Used to test if a number is equal to a specified number.                   |
| IsNumberNotEqual             | Used to test if a number is not equal to a specified number.               |
| IsNumberLessThan             | Used to test if a number is less than a specified number.                  |
| IsNumberLessThanOrEqual      | Used to test if a number is less than or equal to a specified number.      |
| IsNumberGreaterThan          | Used to test if a number is greater than a specified number.               |
| IsNumberGreaterThanOrEqual   | Used to test if a number is greater than or equal to a specified number.   |
| CreditCard                   | Used to test if a number is a valid credit card number.                    |


*   These **rules** are used to lay the validation rules for any model.
*   These rules can be chained in a **fluent** manner.
*   These rules are available via **IValidator\<T\>** interface the framework provides. 

**Sample usage:**

**Models**

```typescript
    class Employee {
        Name: string;
        Password: string;
        PreviousPasswords: string[];
        CreditCards: CreditCard[];
        Super: Super;
        Email: string;
    }

    class CreditCard {
        Number: number;
        Name: string;
        ExpiryDate: Date;
    }
 
    class Super {
        Name: string;
        Code: string;
    }
```

**Validation rules**

```typescript
/* Install npm package ts.validator.fluent and then import like below */
import { IValidator, Validator, ValidationResult } from 'ts.validator.fluent/dist';
```

```typescript
 var validateSuperRules =  (validator: IValidator<Super>) : ValidationResult => {
   return validator
            .NotNull(m => m.Name, "Should not be null", "Super.Name.Null")
            .NotNull(m => m.Code, "Should not be null", "Super.Code.Null")
            .If(m => m.Name != null && m.Code != null, validator => validator 
                                                          .NotEmpty(m => m.Name, "Should not be empty", "Super.Name.Empty")
                                                          .Matches(m => m.Code, "^[a-zA-Z]{2}\\d{4}$", "Should not be invalid", "Super.Code.Invalid")
                                                      .ToResult())
         .ToResult();
 };
``` 
```typescript
 var validateCreditCardRules =  (validator: IValidator<CreditCard>) : ValidationResult => {  
  return validator
            .NotNull(m => m.Name, "Should not be null", "CreditCard.Name.Null")
            .NotNull(m => m.Number, "Should not be null", "CreditCard.Number.Null")
            .NotNull(m => m.ExpiryDate, "Should not be null", "CreditCard.ExpiryDate.Null")
            .If(m => m.Name != null && m.Number > 0 && m.ExpiryDate != null, validator => validator 
                                                          .NotEmpty(m => m.Name, "Should not be empty", "CreditCard.Name.Empty")
                                                          .CreditCard(m => m.Number, "Should not be invalid", "CreditCard.Number.Invalid")
                                                          .IsDateOnOrAfter(m => m.ExpiryDate, new Date(), "Should be on or after today's date", "CreditCard.ExpiryDate.Invalid")
                                                      .ToResult())
        .ToResult();
 };
```
```typescript
 var validateEmployeeRules = (validator: IValidator<Employee>) : ValidationResult => {
    return validator                              
          .NotEmpty(m => m.Name, "Should not be empty", "Employee.Name.Empty")
          .NotNull(m => m.CreditCards, "Should not be null", "CreditCard.Null")
          .NotNull(m => m.Super, "Should not be null", "Super.Null")
          .NotEmpty(m => m.Email, "Should not be empty", "Employee.Email.Empty")
          .If(m => m.Super != null, validator => validator.ForType(m => m.Super, validateSuperRules).ToResult())
          .If(m => m.Email != '', validator => 
                                              validator.Email(m => m.Email, "Should not be invalid", "Employee.Email.Invalid")
                                  .ToResult())  
          .Required(m => m.CreditCards, (m, creditCards) => creditCards.length > 0, "Must have atleast 1 credit card", "Employee.CreditCards.Required")
          .If(m => m.CreditCards != null && m.CreditCards.length > 0, 
                      validator => validator
                                          .ForEach(m => m.CreditCards, validateCreditCardRules)
                                  .ToResult())
          .If(m => m.Password != '', validator => validator
                                          .ForStringProperty(m => m.Password, passwordValidator => passwordValidator
                                                  .Matches("(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])", "Password strength is not valid", "Employee.Password.Strength")
                                                  .Required((m, pwd) => pwd.length > 3, "Password length should be greater than 3", "Employee.Password.Length")
                                                  .Required((m, pwd) => !m.PreviousPasswords.some(prevPwd => prevPwd == pwd), "Password is already used", "Employee.Password.AlreadyUsed")
                                              .ToResult())
                                     .ToResult())                                                                                                                    
    .ToResult();
 };
```

**Populate models**

```typescript
    var model = new Employee();
    model.Name = "John Doe";

    model.Password = "sD4A3";
    model.PreviousPasswords = new Array<string>()     
    model.PreviousPasswords.push("sD4A");
    model.PreviousPasswords.push("sD4A1");
    model.PreviousPasswords.push("sD4A2");

    var expiryDate = new Date();

    model.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    masterCard.Name = "John Doe"
    masterCard.ExpiryDate = expiryDate;
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    amexCard.Name = "John Doe"
    amexCard.ExpiryDate = expiryDate;
    model.CreditCards.push(masterCard);
    model.CreditCards.push(amexCard);

    model.Super = new Super();
    model.Super.Name = "XYZ Super Fund";
    model.Super.Code = "XY1234";

    model.Email = "john.doe@xyx.com";
```

**Synchronous validation**

```typescript
    var validationResult = new Validator(model).Validate(validateEmployeeRules);   
```

**Asynchronous validation**

```typescript
    var validationResult = await new Validator(model).ValidateAsync(validateEmployeeRules);
```

**Validation result**

```typescript
    //Check if the model is valid.
    var isValid = validationResult.IsValid;

    //Get all errors.
    var allErrors = validationResult.Errors;

    //Get error for a particular identifier
    var employeeNameError = validationResult.Identifier("Employee.Name.Empty");

    //Get all errors which start with some identifier string. 
    //Below code will return Super.Code.Empty and Super.Code.Invalid errors
    var superCodeErrors = validationResult.IdentifierStartsWith("Super.Code");
```

### Summary of above code snippets

*   The models are **Employee**, **Credit Card**, **Super**.
*   The Employee model has CreditCard and Super as the child models.
*   The **rules** for Super, CreditCard and Employee validation are laid in the **validateSuperRules**, **validateCreditCardRules** and **validateEmployeeRules** functions, using the **IValidator\<T\>** interface the framework provides.
*   The Super and CreditCard rules are chained and used in the Employee validation.
*   The rules are the same for both Sync and Async.
*   For Sync and Async validation, the **Validate** and **ValidateAsync** methods on the framework class **Validator** are used.
*   The Employee object is passed to this class and goes through the validation rules laid.
*   Each validation rule comprises of a property on which the validation will apply, a message for any error and an identifier string for the error.
*   The **identifier string** is used to **group messages** together for a field.
*   The framework provides an API called **IdentifierStartsWith** which fetches all the validation errors for a particular identifier starts with the text.
*   Eg. “Super” will fetch all errors whose identifier starts with Super.

## Inheritance support

Let us say there is a class Accountant that inherits from Employee.

**Models**

```typescript
 class Accountant extends Employee {
   Code: string;
 }
```

**Validation rules**

```typescript
var validateAccountantRules = (validator: IValidator<Accountant>) : ValidationResult => {
  return validator
            .NotEmpty(m => m.Code, "Should not be empty")
        .ToResult();
};
```

**Populate models**

```typescript
    var accountant = new Accountant();
    accountant.Code = "ACC001";

    //Employee data
    accountant.Name = "John Doe";

    accountant.Password = "sD4A3";
    accountant.PreviousPasswords = new Array<string>()     
    accountant.PreviousPasswords.push("sD4A");
    accountant.PreviousPasswords.push("sD4A1");
    accountant.PreviousPasswords.push("sD4A2");

    var expiryDate = new Date();

    accountant.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    masterCard.Name = "John Doe"
    masterCard.ExpiryDate = expiryDate;
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    amexCard.Name = "John Doe";
    amexCard.ExpiryDate = expiryDate;
    accountant.CreditCards.push(masterCard);
    accountant.CreditCards.push(amexCard);

    accountant.Super = new Super();
    accountant.Super.Name = "XYZ Super Fund";
    accountant.Super.Code = "XY1234";

    accountant.Email = "john.doe@xyx.com";
```

**Synchronous validation**

```typescript
    var validationResult = new Validator(accountant).ValidateBase(validateEmployeeRules)
                                                    .Validate(validateAccountantRules); 
```

**Asynchronous validation**

```typescript
    var validationResult = await new Validator(accountant).ValidateBaseAsync(validateEmployeeRules)
                                                          .ValidateAsync(validateAccountantRules); 
```

### Summary of above code snippets

*   The **Accountant** model inherits from **Employee**.
*   The validation rules for Accountant model (**validateAccountantRules**) only validate the properties of the Accountant class.
*   The base class Employee is validated using **ValidateBase** and **ValidateBaseAsync** methods and the Employee validation rules.