using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services.Helpers
{
    public class ValidationHelper
    {
        // Validates the provided object using data annotations.
        internal static void ModelValidation(object obj)
        {
            // Create a validation context for the object
            ValidationContext validationContext = new ValidationContext(obj);

            // List to store validation results
            List<ValidationResult> validationResults = new List<ValidationResult>();

            // Perform validation using data annotations
            bool isValid = Validator.TryValidateObject(obj, validationContext, validationResults, true);

             // If validation fails, throw an ArgumentException with the first error message
            if (!isValid)
            {
                throw new ArgumentException(validationResults.FirstOrDefault()?.ErrorMessage);
            }
        }
    }
}