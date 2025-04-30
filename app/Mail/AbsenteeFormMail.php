<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AbsenteeFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public $formUrl;

    public function __construct($formUrl)
    {
        $this->formUrl = $formUrl;
    }

    public function build()
    {
        return $this->subject('Absentee Form')
                    ->view('emails.absentee_form')
                    ->with(['formUrl' => $this->formUrl]);
    }
}
