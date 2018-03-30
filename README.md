# ts.validator

TypeScript based generic validation framework

Sample usage:

    class Employee {
        Name: string;
        CreditCard: CreditCard;
        Super: Super;
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
    model.CreditCard = new CreditCard();
    model.CreditCard.Number = 5105105105105100;
    model.Super = new Super();
    model.Super.Name = "XYZ Super Fund";
    model.Super.Code = "XY1234";

    var validationErrors = new Validator(model)                              
                              .NotEmpty(m => m.Name, "Should not be empty", "Employee.Name.Empty")
                              .NotNull(m => m.CreditCard, "Should not be null", "CreditCard.Null")
                              .If(m => m.CreditCard != null, validator => validator
                                                                              .CreditCard(m => m.CreditCard.Number, "Should not be invalid", "CreditCard.Number.Invalid")
                                                                          .Exec())
                              .NotNull(m => m.Super, "Should not be null", "Super.Null")
                              .If(m => m.Super != null, validator => validator
                                                                          .NotEmpty(m => m.Super.Name, "Should not be empty", "Super.Code.Empty")
                                                                          .Matches(m => m.Super.Code, "^[a-zA-Z]{2}\\d{4}$", "Should not be invalid", "Super.Code.Invalid")
                                                                      .Exec())
                          .Exec();