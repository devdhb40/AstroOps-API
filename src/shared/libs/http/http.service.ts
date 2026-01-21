import { HttpService as $HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class HttpService {
  constructor(private readonly httpService: $HttpService) {}

  private handleError(error: AxiosError): never {
    const status: number = error.response?.status ?? 500;
    const message: string = error.message ?? 'error.request_failed';

    throw new HttpException(message, status);
  }

  post<T>(
    url: string,
    body: any,
    config?: AxiosRequestConfig<any>,
  ): Promise<T> {
    return firstValueFrom(
      this.httpService.post<T>(url, body, config).pipe(
        map((response) => response.data),
        catchError((err) => {
          this.handleError(err);
        }),
      ),
    );
  }

  get<T>(url: string, config?: AxiosRequestConfig<any>): Promise<T> {
    return firstValueFrom(
      this.httpService.get<T>(url, config).pipe(
        map((response) => response.data),
        catchError((err) => {
          this.handleError(err);
        }),
      ),
    );
  }

  put<T>(url: string, body: any, config?: AxiosRequestConfig<any>): Promise<T> {
    return firstValueFrom(
      this.httpService.put<T>(url, body, config).pipe(
        map((response) => response.data),
        catchError((err) => {
          this.handleError(err);
        }),
      ),
    );
  }

  delete<T>(url: string, config?: AxiosRequestConfig<any>): Promise<T> {
    return firstValueFrom(
      this.httpService.delete<T>(url, config).pipe(
        map((response) => response.data),
        catchError((err) => {
          this.handleError(err);
        }),
      ),
    );
  }
}
