# ts.validator

TypeScript based generic validation framework

Sample usage:

    var model = new Employee();
    model.Super = new Super();
    model.Super.Name = "XYZ Super Fund";

    var validationErrors = new Validator(model)
                                  .NotNull(m => m.Super, "Super should not be null")
                                  .If(m => m.Super != null, validator => validator
                                                                                 .NotEmpty(m => m.Super.Name, "Super Name should not be empty")
                                                                        .Exec())
                          .Exec();