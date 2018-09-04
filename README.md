# ts.validator

## TypeScript based generic validation framework

[**Demo Angular 6 CLI app using the framework**](https://github.com/VeritasSoftware/ts-validator-app-angular6)

[**Article on framework**](https://www.c-sharpcorner.com/article/ts-validator-typescript-based-generic-validation-framework/)

| API          | Description                                                                    |
| ------------ | ------------------------------------------------------------------------------ |
| If           | Used for program flow. The then part is only evaluated if the if part is true. |
| ForEach      | Used to iterate and apply validations to an array.                             |
| For          | Used to stack multiple validations against a single property.                  |
| ForType      | Used to chain validation rules for a type against a single property.           |
| Required     | Used to test if a property is true to a conditon.                              |
| NotNull      | Used to test if a property is not null.                                        |
| IsNull       | Used to test if a property is null.                                            |
| NotEmpty     | Used to test if a string property is not empty.                                |
| IsEmpty      | Used to test if a string property is empty.                                    |
| Length       | Used to test if a string length is between specified lengths.                  |
| Matches      | Used to test if a string property matches a regular expression.                |
| NotMatches   | Used to test if a string property does not match a regular expression.         |
| CreditCard   | Used to test if a number property is a valid credit card number.               |
| Email        | Used to test if a string property is a valid email address.                    |
| ToResult     | Returns the validation result.                                                 |

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
    }

    class Super {
        Name: string;
        Code: string;
    }
```

**Validation rules**

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
            .If(m => m.Name != null && m.Number > 0, validator => validator 
                                                          .NotEmpty(m => m.Name, "Should not be empty", "CreditCard.Name.Empty")
                                                          .CreditCard(m => m.Number, "Should not be invalid", "CreditCard.Number.Invalid")
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
          .Required(m => m.CreditCards, (m, creditCards) => creditCards.length > 0, "Must have atleast 1 credit card", "CreditCard.Required")
          .If(m => m.CreditCards != null && m.CreditCards.length > 0, 
                      validator => validator
                                          .ForEach(m => m.CreditCards, validateCreditCardRules)
                                  .ToResult())
        .If(m => m.Password != '', validator => 
                                        validator.For(m => m.Password, passwordValidator =>
                                                                          passwordValidator.Matches("(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])", "Password strength is not valid")
                                                                                           .Required((m, pwd) => pwd.length > 3, "Password length should be greater than 3")
                                                                                           .Required((m, pwd) => !m.PreviousPasswords.some(prevPwd => prevPwd == pwd), "Password is already used")
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

    model.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    masterCard.Name = "John Doe"
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    amexCard.Name = "John Doe"
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

### Summary of above code snippetson

*   The models are **Employee**, **Credit Card**, **Super**.
*   The Employee model has CreditCard and Super as the child models.
*   First, an object of Employee model is created and the data for the properties populated.
*   The **rules** for Super and Employee validation are laid in the **validateSuperRules**, **validateCreditCardRules** and **validateEmployeeRules** function, using the **IValidator\<T\>** interface the framework provides.
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

    accountant.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    masterCard.Name = "John Doe"
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    amexCard.Name = "John Doe"
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