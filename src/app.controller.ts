import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { randomUUID } from 'crypto';
import * as qrcode from 'qrcode';
const map = new Map<string, QrCodeInfo>();

interface QrCodeInfo {
  /** 扫码状态
   * - noscan：未扫描
   * - scan-wait-confirm：已扫描，等待用户确认
   * - scan-confirm：已扫描，用户同意授权
   * - scan-cancel：已扫描，用户取消授权
   * - expired：已过期
   */
  status:
    | 'noscan'
    | 'scan-wait-confirm'
    | 'scan-confirm'
    | 'scan-cancel'
    | 'expired';
  userInfo?: {
    userId: number;
  };
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('qrcode/generate')
  async generate() {
    const uuid = randomUUID();
    const dataUrl = await qrcode.toDataURL(
      `http://localhost:3000/pages/confirm.html?id=${uuid}`,
    );
    map.set(`qrcode_${uuid}`, {
      status: 'noscan',
    });
    return {
      qrcode_id: uuid,
      img: dataUrl,
    };
  }
}
