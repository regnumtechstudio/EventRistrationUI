import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

   constructor(
    private toastr: ToastrService,
    private router: Router
  ) { }

    showMessage(title: string, message: string, severity: MessageSeverity) {
    if (!severity) {
      severity = MessageSeverity.default;
    }

    switch (severity) {
      case MessageSeverity.default:
      case MessageSeverity.info:
        this.toastr.info(message, title);
        break;
      case MessageSeverity.success:
        this.toastr.success(message, title);
        break;
      case MessageSeverity.error:
        this.toastr.error(message, title);
        break;
      case MessageSeverity.warn:
        this.toastr.warning(message, title);
        break;
      case MessageSeverity.wait:
        this.toastr.warning('implimentation pending', 'RND pending');
        break;
    }


  }

}

export enum MessageSeverity {
  default,
  info,
  success,
  error,
  warn,
  wait
}
