# ts.validator

TypeScript based generic validation framework

Sample usage:

    class Employee {
        Super: Super;
    }

    class Super {
        Name: string;
        Code: string;
    }

    var model = new Employee();
    model.Super = new Super();
    model.Super.Name = "XYZ Super Fund";
    model.Super.Code = "XY1234";

    var validationErrors = new Validator(model)
                                  .NotNull(m => m.Super, "Super should not be null")
                                  .If(m => m.Super != null, validator => validator
                                                                                 .NotEmpty(m => m.Super.Name, "Super Name should not be empty")
                                                                                 .Matches(m => m.Super.Code, "^[a-zA-Z]{2}\\d{4}$", "Super Code is invalid")
                                                                        .Exec())
                          .Exec();