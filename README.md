# ts.validator

**TypeScript based generic validation framework**

[Demo Angular 5 CLI app using the framework](https://github.com/VeritasSoftware/ts.validator.app)

| API          | Description                                                                    |
| ------------ | ------------------------------------------------------------------------------ |
| If           | Used for program flow. The then part is only evaluated if the if part is true. |
| ForEach      | Used to iterate and apply validations to an array.                             |
| Required     | Used to test if a property is true to a conditon.                              |
| NotNull      | Used to test if a property is not null.                                        |
| IsNull       | Used to test if a property is null.                                            |
| NotEmpty     | Used to test if a string property is not empty.                                |
| IsEmpty      | Used to test if a string property is empty.                                    |
| Matches      | Used to test if a string property matches a regular expression.                |
| NotMatches   | Used to test if a string property does not match a regular expression.         |
| CreditCard   | Used to test if a number property is a valid credit card number.               |
| Email        | Used to test if a string property is a valid email address.                    |
| Exec         | Returns the validation result.                                                 |

**Sample usage:**

```typescript
    class Employee {
        Name: string;
        CreditCards: CreditCard[];
        Super: Super;
        Email: string;
    }

    class CreditCard {
        Number: number;
    }

    class Super {
        Name: string;
        Code: string;
    }

    var model = new Employee();
    model.Name = "John Doe";

    model.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    model.CreditCards.push(masterCard);
    model.CreditCards.push(amexCard);

    model.Super = new Super();
    model.Super.Name = "XYZ Super Fund";
    model.Super.Code = "XY1234";

    model.Email = "john.doe@xyx.com";

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
                            .Exec();  
     

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