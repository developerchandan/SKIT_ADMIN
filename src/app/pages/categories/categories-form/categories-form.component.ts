import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../service/category.service';
import { Category, Subcategory } from '../../model/categories';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css'],
})
export class CategoriesFormComponent {
  categoryForm!: FormGroup;
  subCategoryForm!: FormGroup;
  getCategoryList!: Category[];

  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initializeCategoryForm();
    this.initializeSubCategoryForm();
    this.getCategory();
  }

  initializeCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      categorySelect: [''],
    });
  }
  initializeSubCategoryForm() {
    this.subCategoryForm = this.formBuilder.group({
      categoryId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  getCategory() {
    this.categoryService.getCategories().subscribe((res: Category[]) => {
      this.getCategoryList = res;
      console.log('categoryData', this.getCategoryList);
    });
  }

  addCategory() {
    if (this.categoryForm.valid) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to add this category?',
        accept: () => {
          const categoryData = this.categoryForm.value;
          this.categoryService.createCategory(categoryData).subscribe(
            (createdCategory) => {
              // Handle the response from the API or perform any necessary actions
              console.log('Category created:', createdCategory);
  
              // Reset the form after successful submission
              this.categoryForm.reset();
  
              // Show success message
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category added successfully!' });
              this.getCategory();
            },
            (error) => {
              console.error('Error adding category:', error);
  
              // Show error message
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add category!' });
            }
          );
        },
      });
    }
  }

  addSubCategory(): void {
    debugger;
    if (this.subCategoryForm.valid) {
      const categoryId = this.subCategoryForm.value.categoryId;
      const subcategoryData: Subcategory = {
        categoryId: categoryId,
        name: this.subCategoryForm.value.name,
        description: this.subCategoryForm.value.description,
      };

      this.categoryService.createSubcategory(categoryId, subcategoryData).subscribe(
        (savedSubcategory) => {
          console.log('Subcategory added:', savedSubcategory);
          this.subCategoryForm.reset();
  
          // Show success message
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Subcategory added successfully!' });
          this.getCategory();
        },
        (error) => {
          console.error('Error adding subcategory:', error);
  
          // Show error message
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add subcategory!' });
        }
    );
      }
    }  
}
