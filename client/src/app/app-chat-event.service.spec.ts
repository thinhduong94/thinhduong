import { TestBed, inject } from '@angular/core/testing';

import { AppChatEventService } from './app-chat-event.service';

describe('AppChatEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppChatEventService]
    });
  });

  it('should be created', inject([AppChatEventService], (service: AppChatEventService) => {
    expect(service).toBeTruthy();
  }));
});
