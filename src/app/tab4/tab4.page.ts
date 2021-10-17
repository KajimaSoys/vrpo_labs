import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { of } from "rxjs";

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {
  images;
  fileData;
  constructor(private http: HttpClient, private camera: Camera, private androidPermissions: AndroidPermissions) {}
  cameraImage:string;
  cameraOptions: CameraOptions = {
    quality: 20,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  takeSnap() {
    this.camera.getPicture(this.cameraOptions).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.cameraImage = base64Image;
    }, (err) => {
      console.log(err);
    });

    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
    //   result => console.log('Has permission?',result.hasPermission),
    //   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    // );
    //
    // this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);

  }
  ngOnInit() {
    this.refreshImages();
    this.cameraImage = "";
  }
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
  }
  onClickSubmit() {
    const formData = new FormData();
    formData.append('image', this.fileData, this.fileData.name);
    this.http.post("http://studentapi.myknitu.ru/send/", formData)
      .subscribe(() => this.refreshImages());
  }
  onClickSubmitBase64(data) {
    const formData = new FormData();
    formData.append('image', data.cameraImage);
    this.http.post("http://studentapi.myknitu.ru/send2/", formData)
      .subscribe(() => this.refreshImages());
  }
  refreshImages() {
    this.http.get("http://studentapi.myknitu.ru").subscribe(data => {
      data['images'].forEach(element => element['img'] = element['img'].toString().replace("https", "http"));
      console.log(data);
      this.images = data["images"];
    });
  }
}
