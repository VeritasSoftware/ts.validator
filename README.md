# ts.validator

## TypeScript based generic validation framework

[**Demo Angular 6 CLI app using the framework**](https://github.com/VeritasSoftware/ts-validator-app-angular6)

[**Article on framework**](https://www.c-sharpcorner.com/article/ts-validator-typescript-based-generic-validation-framework/)

| API          | Description                                                                    |
| ------------ | ------------------------------------------------------------------------------ |
| If           | Used for program flow. The then part is only evaluated if the if part is true. |
| ForEach      | Used to iterate and apply validations to an array.                             |
| For          | Used to stack multiple validations against a single property.                  |
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
| Exec         | Returns the validation result.                                                 |

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
    var validationResult = new Validator(model)                              
                                .NotEmpty(m => m.Name, "Should not be empty", "Employee.Name.Empty")
                                .NotNull(m => m.CreditCards, "Should not be null", "CreditCard.Null")
                                .NotNull(m => m.Super, "Should not be null", "Super.Null")
                                .NotEmpty(m => m.Email, "Should not be empty", "Employee.Email.Empty")
                                .If(m => m.Super != null, validator => validator
                                                                                .NotEmpty(m => m.Super.Name, "Should not be empty", "Super.Code.Empty")
                                                                                .Matches(m => m.Super.Code, "^[a-zA-Z]{2}\\d{4}$", "Should not be invalid", "Super.Code.Invalid")
                                                                      .Exec())
                                .If(m => m.Email != '', validator => 
                                                                    validator.Email(m => m.Email, "Should not be invalid", "Employee.Email.Invalid")
                                                        .Exec())  
                                .Required(m => m.CreditCards, (m, creditCards) => creditCards.length > 0, "Must have atleast 1 credit card", "CreditCard.Required")
                                .If(m => m.CreditCards != null && m.CreditCards.length > 0, 
                                            validator => validator
                                                                .ForEach(m => m.CreditCards, validator => 
                                                                                                  validator.CreditCard(m => m.Number, "Should not be invalid", "CreditCard.Number.Invalid")                                                                                         
                                                                                            .Exec())
                                                        .Exec())
                               .If(m => m.Password != '', validator => 
                                                              validator.For(m => m.Password, passwordValidator =>
                                                                                                passwordValidator.Matches("(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])", "Password strength is not valid")
                                                                                                                 .Required((m, pwd) => pwd.length > 3, "Password length should be greater than 3")
                                                                                                                 .Required((m, pwd) => !m.PreviousPasswords.some(prevPwd => prevPwd == pwd), "Password is already used")
                                                                                             .Exec())
                                                              .Exec())                                                                                                                    
                            .Exec();    
```

**Asynchronous validation**

```typescript
    var validationResult = await new ValidatorAsync(model).Validate(validator => validator                              
                                      .NotEmpty(m => m.Name, "Should not be empty", "Employee.Name.Empty")
                                      .NotNull(m => m.CreditCards, "Should not be null", "CreditCard.Null")
                                      .NotNull(m => m.Super, "Should not be null", "Super.Null")
                                      .NotEmpty(m => m.Email, "Should not be empty", "Employee.Email.Empty")
                                      .If(m => m.Super != null, validator => validator
                                                                                      .NotEmpty(m => m.Super.Name, "Should not be empty", "Super.Code.Empty")
                                                                                      .Matches(m => m.Super.Code, "^[a-zA-Z]{2}\\d{4}$", "Should not be invalid", "Super.Code.Invalid")
                                                                            .Exec())
                                      .If(m => m.Email != '', validator => 
                                                                          validator.Email(m => m.Email, "Should not be invalid", "Employee.Email.Invalid")
                                                              .Exec())  
                                      .Required(m => m.CreditCards, (m, creditCards) => creditCards.length > 0, "Must have atleast 1 credit card", "CreditCard.Required")
                                      .If(m => m.CreditCards != null && m.CreditCards.length > 0, 
                                                  validator => validator
                                                                      .ForEach(m => m.CreditCards, validator => 
                                                                                                        validator.CreditCard(m => m.Number, "Should not be invalid", "CreditCard.Number.Invalid")                                                                                         
                                                                                                  .Exec())
                                                              .Exec())
                                    .If(m => m.Password != '', validator => 
                                                                    validator.For(m => m.Password, passwordValidator =>
                                                                                                      passwordValidator.Matches("(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])", "Password strength is not valid")
                                                                                                                      .Required((m, pwd) => pwd.length > 3, "Password length should be greater than 3")
                                                                                                                      .Required((m, pwd) => !m.PreviousPasswords.some(prevPwd => prevPwd == pwd), "Password is already used")
                                                                                                  .Exec())
                                                                    .Exec())                                                                                                                    
                                  .Exec());
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

**In the above code snippet:**

*   The models are **Employee**, **Credit Card**, **Super**.
*   The Employee model has CreditCard and Super as the child models.
*   First, an object of Employee model is created and the data for the properties populated.
*   The **rules** for Employee validation are laid using the **Validator** and the **ValidatorAsync** classes the framework provides.
*   The Employee object is passed to this class and goes through the validation rules laid.
*   Each validation rule comprises of a property on which the validation will apply, a message for any error and an identifier string for the error.
*   The **identifier string** is used to **group messages** together for a field.
*   The framework provides an API called **IdentifierStartsWith** which fetches all the validation errors for a particular identifier starts with the text.
*   Eg. “Super.Code” will fetch all errors whose identifier starts with Super.Code.