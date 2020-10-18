import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ProductDataService } from 'src/app/services/product-data.service';

@Component({
  selector: 'app-add-edit-modal',
  templateUrl: './add-edit-modal.component.html',
  styleUrls: ['./add-edit-modal.component.css']
})
export class AddEditModalComponent implements OnInit {

  prodDetailsForm: FormGroup
  cost_price: any;
  selling_price_error: boolean = false;
  loader = false;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddEditModalComponent>,
  private productService: ProductDataService, private matDialog: MatDialog, private fb: FormBuilder) {  
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
      this.dialogRef.updateSize('60%');
      this.prodDetailsForm = this.fb.group({
        product_name: ['', Validators.required],
        cost_price: ['', Validators.required],
        selling_price: ['',Validators.required],
        units_available: ['',Validators.required],
    });

    if(this.data.action === 'View/Edit'){
      this.setData();
    }
  }


  setData(){
    this.prodDetailsForm.patchValue({
      'product_name': this.data.formData.product_name,
      'cost_price': this.data.formData.cost_price,
      'selling_price': this.data.formData.selling_price,
      'units_available': this.data.formData.units_available
    })

    this.cost_price = this.prodDetailsForm.controls.cost_price.value;

    this.prodDetailsForm.controls.cost_price.disable();
    this.prodDetailsForm.controls.units_available.disable();

  }


  updateProduct(): void {
    this.loader = true;
    let data ={
      'product_name': this.prodDetailsForm.controls.product_name.value,
      'selling_price': this.prodDetailsForm.controls.selling_price.value
    }
    this.productService.update(this.data.formData.id, data)
      .subscribe(
        response => {
          console.log(response);
          this.loader = false;
          this.dialogRef.close();
        },
        error => {
          this.loader = false;
          console.log(error);
        });
  }


  saveProduct(): void {
    this.loader = true;
    const data = {
      product_name: this.prodDetailsForm.controls.product_name.value,
      cost_price: this.prodDetailsForm.controls.cost_price.value,
      selling_price: this.prodDetailsForm.controls.selling_price.value,
      units_available: this.prodDetailsForm.controls.units_available.value,
    };

    this.productService.create(data)
      .subscribe(
        response => {
          console.log(response);
          this.loader = false;
          this.dialogRef.close()
        },
        error => {
          this.loader = false;
          console.log(error);
        });
  }


  validateSellingPrice(){
    if(this.cost_price && this.prodDetailsForm.controls.selling_price.value && 
      this.prodDetailsForm.controls.selling_price.value < this.cost_price){
          this.selling_price_error = true;
    }else if(this.prodDetailsForm.controls.cost_price.value && this.prodDetailsForm.controls.selling_price.value && 
      this.prodDetailsForm.controls.selling_price.value < this.prodDetailsForm.controls.cost_price.value){
          this.selling_price_error = true;
    }else{
      this.selling_price_error = false;
    }
  }

  close(){
    this.dialogRef.close();
  }

}
