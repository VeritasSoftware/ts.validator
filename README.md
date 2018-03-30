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
    model.Name = "John Doe";
    model.Super = new Super();
    model.Super.Name = "XYZ Super Fund";
    model.Super.Code = "XY1234";

    var validationErrors = new Validator(model)                              
                              .NotEmpty(m => m.Name, "should not be empty", "Employee.Name.Empty")
                              .NotNull(m => m.Super, "should not be null", "Super.Null")
                              .If(m => m.Super != null, validator => validator
                                                                          .NotEmpty(m => m.Super.Name, "should not be empty", "Super.Code.Empty")
                                                                          .Matches(m => m.Super.Code, "^[a-zA-Z]{2}\\d{4}$", "should not be invalid", "Super.Code.Invalid")
                                                                      .Exec())
                          .Exec();